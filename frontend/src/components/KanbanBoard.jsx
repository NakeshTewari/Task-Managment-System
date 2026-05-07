import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

const COLUMNS = [
  { id: "todo",        title: "To Do",       color: "bg-gray-400"  },
  { id: "in_progress", title: "In Progress",  color: "bg-blue-500"  },
  { id: "done",        title: "Done",         color: "bg-emerald-500" },
];

export default function KanbanBoard({ tasks, onDragEnd, onTaskClick }) {

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const taskId   = result.draggableId;
    const newStatus = result.destination.droppableId;
    onDragEnd(taskId, newStatus);
  };

  // group tasks by status
  const grouped = { todo: [], in_progress: [], done: [] };
  tasks.forEach((task) => {
    if (grouped[task.status]) grouped[task.status].push(task);
  });

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {COLUMNS.map((col) => (
          <Droppable droppableId={col.id} key={col.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`rounded-2xl border transition-colors duration-200 flex flex-col ${
                  snapshot.isDraggingOver
                    ? "bg-blue-50 border-blue-300"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                {/* olumn Header */}
                <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                    <h3 className="text-sm font-semibold text-gray-700">
                      {col.title}
                    </h3>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    grouped[col.id].length > 0
                      ? "bg-gray-200 text-gray-600"
                      : "bg-gray-100 text-gray-400"
                  }`}>
                    {grouped[col.id].length}
                  </span>
                </div>

                {/* Task list */}
                <div className="p-3 space-y-2 min-h-[200px] flex-1">

                  {grouped[col.id].length === 0 && !snapshot.isDraggingOver && (
                    <div className="flex flex-col items-center justify-center h-24 text-center">
                      <p className="text-xs text-gray-400">No tasks here</p>
                      <p className="text-xs text-gray-300 mt-0.5">Drag a card here</p>
                    </div>
                  )}

                  {grouped[col.id].map((task, index) => (
                    <Draggable
                      draggableId={task.id.toString()}
                      index={index}
                      key={task.id}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => onTaskClick?.(task)}
                          className={`transition-transform duration-150 ${
                            snapshot.isDragging ? "rotate-1 scale-105" : ""
                          }`}
                          style={provided.draggableProps.style}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>

              </div>
            )}
          </Droppable>
        ))}

      </div>
    </DragDropContext>
  );
}