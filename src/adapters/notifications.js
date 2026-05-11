export function notificationPageResponseToAlerts(response) {
  const items = response?.items || response?.content || [];
  return items.map((item) => ({
    id: item.notificationId,
    title: item.title,
    desc: item.message,
    time: item.createdAt,
    read: item.isRead,
    inspectionId: item.inspectionId || null,
  }));
}
