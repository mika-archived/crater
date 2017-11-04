// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'
import jsSHA from 'jssha'

// Logger
function logger(message) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[CRATER] ${message}`)
  }
}

// Chrome storage
function save(key, value, callback) {
  if (key === '') {
    logger('Invalid key, ignored')
    return
  }
  const hash = toHash(key)
  logger(`Saving data => key: ${key}, value: ${JSON.stringify(value)}`)
  chrome.storage.local.set({ [hash]: value }, callback)
}

function load(key, callback) {
  const hash = toHash(key)
  chrome.storage.local.get(hash, (value) => {
    logger(`Loaded data => key: ${key}, value: ${JSON.stringify(value)}`)
    callback(key, value)
  })
}

function remove(key, callback) {
  chrome.storage.local.remove(toHash(key), callback)
}

// Alert
function crater_save(key) {
  load(key, (_, value) => {
    save(key, JSON.stringify(Object.assign(parse(key, value), { status: 1 })), () => crater_close())
  })
}

function crater_clear(key) {
  remove(key, () => crater_close())
}

function crater_ignore(key) {
  load(key, (_, value) => {
    save(key, JSON.stringify(Object.assign(parse(key, value), { status: 2, data: {} })), () => crater_close())
  })
}

function crater_close() {
  document.querySelector("#crater-alert").className = ''
}

// Utils
function parse(key, value) {
  const hash = toHash(key)
  return JSON.parse(typeof value[hash] === 'string' ? value[hash] : '{}')
}

function toHash(text) {
  const sha = new jsSHA('SHA-256', 'TEXT')
  sha.update(text)
  return sha.getHash('HEX')
}

// STRUCTURE
// status: integer (0 = temporary, 1 = saved, 2 = ignored)
// data: Object (JSON stringified)
function main(key, value) {
  logger(`Running main function... args : ${key}, ${JSON.stringify(value)}`)
  if (key && value && value.hasOwnProperty('status')) {
    logger(`${key} :  Current status is ${value.status}`)
    // has data
    if (value.status === 0) {
      // saved temporry data
      logger('Saved form data, show question alert.')

      const alert = document.createElement('div')
      alert.innerHTML = `
        <p>
          送信したフォームデータを保存しますか？
        </p>
        <div class="crater-grid">
          <div>
            <a href="#" id="crater-create-button" class="crater-button">保存する</a>
          </div>
          <div>
            <a href="#" id="crater-clear-button" class="crater-button">保存しない</a>
          </div>
          <div>
            <a href="#" id="crater-ignore-button" class="crater-button">聞かないで</a>
          </div>
        </div>
      `
      alert.id = 'crater-alert'
      alert.className = 'show'
      document.querySelector('body').appendChild(alert)
      document.querySelector('#crater-create-button').addEventListener('click', () => crater_save(key))
      document.querySelector('#crater-clear-button').addEventListener('click', () => crater_clear(key))
      document.querySelector('#crater-ignore-button').addEventListener('click', () => crater_ignore(key))
    } else if (value.status === 1) {
      if (key !== url) {
        logger('Invalid url (key !== url), skipped.')
        return
      }
      // fill form data
      logger('Try filling input forms.')
      const form = document.querySelector('form')
      if (form) {
        for (const name of Object.keys(value.data)) {
          const element = form.querySelector(`input[name=${name}]`)
          element.value = value.data[name]
        }
      }
      logger('Filled forms. Finished.')
    } else if (value.status === 2) {
      // ignored, nothing to do
      logger('Ignored because user selected `ignored` command.')
    }
  } else {
    // does not have data, nothing to do
    logger('Skipped : does not have data / invalid data structure')
  }
}

// main
const url = location.href;
const referrer = document.referrer;
const version = '1.0'
const ignored = [
  '[type=file]',        // file
  '[type=color]',       // color
  '[type=tel]',         // phone number
  '[type=hidden]',      // hidden
  '[type=password]',    // password
  '[type=email]',       // email
  '[type=submit]',      // ignored
  '[autocomplete=off]', // Disable auto-complete
  '[autocorrect=off]',  // Disable auto-correct
  '[name*=login]',      // login info
  '[name*=username]',   // login info
  '[name*=mail]',       // login info
  '[name*=tel]',        // login info
  '[name*=referrer]',   // temporary used
  '[name*=button]',     // button
  '[name*=\\2fa]',      // Two factor authentication
  '[name*=\\$]',        // ...
  '[name*=remember]',   // Store login session
]

// migration
load('version', (key, value) => {
  if (!value || value === '') {
    logger('Invalid or too older version, migrating.')
    chrome.storage.local.clear();
    save('version', version)
  } else if (value === version) {
    logger(`You use latest version.`)
  } else {
    logger(`Upgrade to ${version}.`)
    save('version', version)
  }
})

load(url, (key, value) => {
  let json = parse(key, value)
  if (Object.keys(json).length !== 0) {
    main(key, json)
  }
  else {
    logger('No data found, try fallback to referrer...')
    if (referrer) {
      load(referrer, (key, value) => {
        json = parse(key, value)
        if (Object.keys(json).length !== 0) {
          main(key, json)
        }
      })
    }
  }
})

// collector
const form = document.querySelector('form')
if (form) {
  form.addEventListener('submit', () => {
    const data = {}
    const selector = `input:${ignored.map((w) => `not(${w})`).join(':')}`;
    [].forEach.call(form.querySelectorAll(selector), (w) => {
      if (!w.name) {
        return
      }
      for (let prop in w.style) {
        if (w.style.hasOwnProperty(prop)) {
          if (prop === 'opacity' && w.style[prop] === '0') {
            return
          }
          if (prop === 'visibility' && w.style[prop] === 'hidden') {
            return
          }
        }
      }
      data[w.name] = w.value
    })
    logger(selector)
    if (Object.keys(data).length > 0 && url !== '') {
      load(url, (key, value) => {
        if (!value && value !== '') {
          save(url, JSON.stringify({ status: 0, data, url }), () => { })          
        }
      })
    }
  })
}
