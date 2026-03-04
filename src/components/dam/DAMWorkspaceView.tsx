import type React from "react";
import { useMemo, useState } from "react";
import type { DAMTask } from "./DAMData";

interface Props {
  tasks: DAMTask[];
  onTaskClick: (taskId: string) => void;
  onTaskStatusChange?: (taskId: string, status: DAMTask["status"]) => void;
}

type WorkspaceTab = "my" | "assigned" | "completed";

export const DAMWorkspaceView: React.FC<Props> = ({ tasks, onTaskClick, onTaskStatusChange }: Props) => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("my");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    if (activeTab === "completed") {
      return tasks.filter((task) => task.status === "done");
    }
    if (activeTab === "assigned") {
      return tasks.filter((task) => task.status !== "done");
    }
    return tasks;
  }, [activeTab, tasks]);

  const selectedTask = filteredTasks.find((task) => task.id === selectedTaskId) || null;

  const getStatusBadge = (status: DAMTask["status"]) => {
    const styles = {
      todo: "bg-[#F1F5F9] text-[#64748B]",
      "in-progress": "bg-[#EFF6FF] text-[#155DFC]",
      review: "bg-[#FFF7ED] text-[#EA580C]",
      done: "bg-[#F0FDF4] text-[#16A34A]",
    };
    return (
      <span className={`px-[8px] py-[2px] rounded-full text-[11px] font-bold uppercase ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority: DAMTask["priority"]) => {
    const styles = {
      low: "bg-gray-100 text-gray-500",
      medium: "bg-blue-100 text-blue-600",
      high: "bg-red-100 text-red-600",
    };
    return (
      <span className={`px-[6px] py-[2px] rounded text-[10px] font-bold uppercase ${styles[priority]}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="flex-1 flex h-full bg-white">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex px-[24px] border-b border-[#E2E8F0]">
          {[
            { id: "my", label: "My tasks" },
            { id: "assigned", label: "Assigned tasks" },
            { id: "completed", label: "Completed tasks" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as WorkspaceTab)}
              className={`px-[16px] py-[14px] text-[14px] font-medium transition-colors relative ${
                activeTab === tab.id ? "text-[#155DFC]" : "text-[#64748B] hover:text-[#0F172B]"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#155DFC]" />
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-[24px]">
          <div className="border border-[#E2E8F0] rounded-[12px] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="w-[40px] px-[12px] py-[12px]">
                    <input type="checkbox" className="rounded border-[#CBD5E1]" />
                  </th>
                  <th className="px-[12px] py-[12px] text-[12px] font-bold text-[#475569] uppercase tracking-wider">Title</th>
                  <th className="px-[12px] py-[12px] text-[12px] font-bold text-[#475569] uppercase tracking-wider">Status</th>
                  <th className="px-[12px] py-[12px] text-[12px] font-bold text-[#475569] uppercase tracking-wider">Priority</th>
                  <th className="px-[12px] py-[12px] text-[12px] font-bold text-[#475569] uppercase tracking-wider">Creator</th>
                  <th className="px-[12px] py-[12px] text-[12px] font-bold text-[#475569] uppercase tracking-wider">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      onClick={() => {
                        setSelectedTaskId(task.id);
                        onTaskClick(task.id);
                      }}
                      className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] cursor-pointer transition-colors group"
                    >
                      <td className="px-[12px] py-[14px]">
                        <input type="checkbox" className="rounded border-[#CBD5E1]" onClick={(e) => e.stopPropagation()} />
                      </td>
                      <td className="px-[12px] py-[14px]">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-[#0F172B] group-hover:text-[#155DFC]">{task.title}</span>
                          <span className="text-[12px] text-[#94A3B8] line-clamp-1">{task.description}</span>
                        </div>
                      </td>
                      <td className="px-[12px] py-[14px]">{getStatusBadge(task.status)}</td>
                      <td className="px-[12px] py-[14px]">{getPriorityBadge(task.priority)}</td>
                      <td className="px-[12px] py-[14px]">
                        <div className="flex items-center gap-[8px]">
                          <div className="w-[24px] h-[24px] rounded-full bg-[#E2E8F0] flex items-center justify-center text-[10px] font-bold text-[#475569]">
                            {task.creator.name.charAt(0)}
                          </div>
                          <span className="text-[13px] text-[#475569]">{task.creator.name}</span>
                        </div>
                      </td>
                      <td className="px-[12px] py-[14px]">
                        <span className="text-[12px] text-[#64748B]">{task.dueDate}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-[12px] py-[60px] text-center text-[14px] text-[#94A3B8]">
                      할당된 작업이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedTask && (
        <aside className="w-[320px] border-l border-[#E2E8F0] bg-[#F8FAFC] p-[20px] flex flex-col gap-[14px]">
          <div className="flex items-start justify-between gap-[10px]">
            <h3 className="text-[15px] font-bold text-[#0F172B]">{selectedTask.title}</h3>
            <button onClick={() => setSelectedTaskId(null)} className="text-[12px] text-[#94A3B8] hover:text-[#64748B]">Close</button>
          </div>
          <p className="text-[13px] text-[#475569]">{selectedTask.description}</p>
          <div className="grid grid-cols-2 gap-[10px]">
            <div className="p-[10px] border border-[#E2E8F0] rounded-[8px] bg-white">
              <p className="text-[11px] text-[#94A3B8]">Status</p>
              <div className="mt-[6px]">{getStatusBadge(selectedTask.status)}</div>
            </div>
            <div className="p-[10px] border border-[#E2E8F0] rounded-[8px] bg-white">
              <p className="text-[11px] text-[#94A3B8]">Priority</p>
              <div className="mt-[6px]">{getPriorityBadge(selectedTask.priority)}</div>
            </div>
          </div>
          <div className="p-[10px] border border-[#E2E8F0] rounded-[8px] bg-white">
            <p className="text-[11px] text-[#94A3B8] mb-[6px]">Change status</p>
            <div className="flex flex-wrap gap-[6px]">
              {(["todo", "in-progress", "review", "done"] as DAMTask["status"][]).map((status) => (
                <button
                  key={status}
                  onClick={() => onTaskStatusChange?.(selectedTask.id, status)}
                  className={`px-[8px] py-[4px] rounded-[6px] text-[11px] border ${
                    selectedTask.status === status ? "border-[#155DFC] text-[#155DFC] bg-[#EFF6FF]" : "border-[#E2E8F0] text-[#64748B] bg-white"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
