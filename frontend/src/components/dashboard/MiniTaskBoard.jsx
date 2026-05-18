import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useData } from '../../context/DataContext';
import { Clock, Activity, AlertCircle } from 'lucide-react';

export default function MiniTaskBoard({ onEditTask }) {
  const { tasks, updateTask } = useData();
  const [data, setData] = useState({ columns: {}, tasks: {}, columnOrder: [] });

  useEffect(() => {
    const cols = {
      'todo': { id: 'todo', title: 'To Do', icon: Clock, taskIds: [] },
      'in-progress': { id: 'in-progress', title: 'In Progress', icon: Activity, taskIds: [] },
      'blocked': { id: 'blocked', title: 'Blocked', icon: AlertCircle, taskIds: [] },
    };
    const tks = {};
    tasks.forEach(t => {
      if (cols[t.status]) {
        tks[t._id] = { ...t, id: t._id, content: t.title };
        cols[t.status].taskIds.push(t._id);
      }
    });
    setData({ columns: cols, tasks: tks, columnOrder: ['todo', 'in-progress', 'blocked'] });
  }, [tasks]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    
    await updateTask(draggableId, { status: destination.droppableId });
  };

  const getPriorityColor = (p) => {
    if (p === 'High') return 'bg-amber-500';
    if (p === 'Medium') return 'bg-blue-500';
    return 'bg-muted-foreground/30';
  };

  return (
    <div className="p-6 rounded-2xl border border-border/30 bg-surface-low h-full shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8">Workload Snapshot</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[300px]">
          {data.columnOrder.map(colId => {
            const column = data.columns[colId];
            if(!column) return null;
            const columnTasks = column.taskIds.map(tId => data.tasks[tId]).filter(Boolean);
            
            return (
              <div key={column.id} className="flex flex-col bg-secondary/10 rounded-2xl p-3 border border-border/10">
                <div className="flex items-center gap-2 mb-4 px-2">
                  <column.icon size={12} className={colId === 'blocked' ? 'text-destructive' : 'text-muted-foreground'} />
                  <h4 className={`text-[9px] font-bold uppercase tracking-widest ${colId === 'blocked' ? 'text-destructive' : 'text-muted-foreground/80'}`}>{column.title}</h4>
                </div>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 space-y-2 overflow-y-auto max-h-[300px] pr-1">
                      {columnTasks.map((task, idx) => (
                        <Draggable key={task.id} draggableId={task.id} index={idx}>
                          {(provided) => (
                            <div 
                              ref={provided.innerRef} 
                              {...provided.draggableProps} 
                              {...provided.dragHandleProps} 
                              onClick={() => onEditTask(task)}
                              className="bg-background/80 backdrop-blur-sm p-3 rounded-xl border border-border/40 shadow-sm text-[11px] font-semibold group hover:border-primary/40 transition-all cursor-pointer"
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-1 h-3 rounded-full mt-0.5 shrink-0 ${getPriorityColor(task.priority)}`} />
                                <span className="truncate group-hover:text-primary transition-colors leading-tight">{task.content}</span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
