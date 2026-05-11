export function accountListResponseToUsers(response) {
  const items = response?.items || [];
  return items.map((item) => ({
    name: item.userName,
    userId: item.loginId || String(item.userId),
    role: item.role?.toLowerCase() || "worker",
    line: item.lineName || item.lineCode || "-",
    shift: item.shiftName || "-",
  }));
}
