import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import { USE_MOCK_API } from "../api/config";
import { getNotifications, markNotificationRead } from "../api/notifications";
import { notificationPageResponseToAlerts } from "../adapters/notifications";
import { alertsData } from "../data/mockData";

export default function AlertsPage() {
  const [tab, setTab] = useState("unread");
  const [alerts, setAlerts] = useState(() => (USE_MOCK_API ? alertsData : []));
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (USE_MOCK_API) return;

    let ignore = false;

    getNotifications({ page: 0, size: 20 })
      .then((data) => {
        if (!ignore) setAlerts(notificationPageResponseToAlerts(data));
      })
      .catch((err) => {
        if (!ignore) setApiError(err.message);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const unreadCount = alerts.filter((a) => !a.read).length;

  const filtered = alerts.filter((a) => {
    if (tab === "unread") return !a.read;
    if (tab === "read") return a.read;
    return true;
  });

  const toggleRead = async (id) => {
    if (!USE_MOCK_API) {
      try {
        await markNotificationRead(id);
      } catch (err) {
        setApiError(err.message);
        return;
      }
    }

    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: !a.read } : a))
    );
  };

  const tabs = [
    { key: "all", label: "전체" },
    { key: "unread", label: "미확인", badge: unreadCount },
    { key: "read", label: "확인완료" },
  ];

  return (
    <div className="relative">
      {apiError && (
        <div className="mb-6 rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error">
          {apiError}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-8 mb-10 border-b-2 border-surface-container">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-4 text-sm font-medium transition-colors relative flex items-center gap-2 ${
              tab === t.key
                ? "font-bold text-primary border-b-2 border-primary"
                : "text-slate-500 hover:text-primary"
            }`}
          >
            {t.label}
            {t.badge > 0 && (
              <span className="bg-error text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="max-w-4xl space-y-4">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            onClick={() => toggleRead(alert.id)}
            className={`group relative rounded-xl p-6 transition-all cursor-pointer ${
              alert.read
                ? "bg-surface-container-low/50 grayscale opacity-70"
                : "bg-surface-container-lowest shadow-sm hover:bg-white hover:shadow-md"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                {/* Icon */}
                <div className="mt-1 flex-shrink-0">
                  {alert.read ? (
                    <Icon name="check_circle" className="text-on-surface-variant" />
                  ) : (
                    <Icon name="error_outline" className="text-error" />
                  )}
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3
                      className={`text-lg font-bold text-on-surface ${
                        alert.read ? "line-through decoration-on-surface-variant/30" : ""
                      }`}
                    >
                      {alert.title}
                    </h3>
                    {alert.read && (
                      <span className="text-xs font-bold text-primary flex items-center gap-1">
                        <Icon name="done" className="text-sm" />
                        확인완료
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-on-surface-variant font-medium">
                    {alert.desc}
                  </p>
                </div>
              </div>

              <span className="text-xs text-on-surface-variant/60 font-medium flex-shrink-0 ml-4">
                {alert.time}
              </span>
            </div>
          </div>
        ))}

        {/* More Button */}
        <div className="pt-8 flex justify-center">
          <button className="px-8 py-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold rounded-lg transition-all flex items-center gap-2">
            더 보기
            <Icon name="keyboard_arrow_down" className="text-sm" />
          </button>
        </div>
      </div>

    </div>
  );
}
