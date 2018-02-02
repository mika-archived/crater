export function calcWithdrawalFee(obj, balance) {
  for (let kvp of obj.fees) {
    if (balance <= kvp.amount) {
      return kvp.fee;
    }
  }
  return 0;
}

export function calcPercentage(obj, balance) {
  return ((balance / obj.minimum) * 100).toFixed(2);
}

export function shouldRunScript(hostname, targets) {
  return location.hostname === hostname && targets.indexOf(location.pathname) >= 0;
}
