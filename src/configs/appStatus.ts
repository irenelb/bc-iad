function appStatus() {
  let currentStatus = true;
  function changeStatus({
    isAbleToHandleRequest,
  }: {
    isAbleToHandleRequest: boolean;
  }) {
    currentStatus = isAbleToHandleRequest;
  }
  function status() {
    return currentStatus;
  }
  return { status, changeStatus };
}

export const applicationStatus = appStatus();
