import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

const columns = [
  { id: "todo", label: "Todo" },
  { id: "in-progress", label: "In progress" },
  { id: "completed", label: "Completed" }
];

export default function KanbanBoard({ tasks, onMove }) {
  const grouped = columns.reduce((acc, column) => {
    acc[column.id] = tasks.filter((task) => task.status === column.id);
    return acc;
  }, {});

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const task = tasks.find((item) => item._id === result.draggableId);
    if (task && result.destination.droppableId !== task.status) {
      onMove(task, result.destination.droppableId);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((column) => (
          <Droppable droppableId={column.id} key={column.id}>
            {(provided) => (
              <section className="glass min-h-96 rounded-lg p-4" ref={provided.innerRef} {...provided.droppableProps}>
                <h3 className="mb-3 text-sm font-black uppercase text-slate-500 dark:text-neutral-400">{column.label}</h3>
                <div className="space-y-3">
                  {grouped[column.id].map((task, index) => (
                    <Draggable draggableId={task._id} index={index} key={task._id}>
                      {(dragProvided) => (
                        <article
                          className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                        >
                          <p className="font-bold">{task.title}</p>
                          <p className="text-xs text-slate-500 dark:text-neutral-400">{task.subject || "General"} - {task.priority}</p>
                        </article>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </section>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
