import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  MoreHorizontal, 
  MessageSquare, 
  Edit2, 
  Trash2, 
  Plus, 
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Activity
} from 'lucide-react';
import { useData } from '../context/DataContext';
import TaskModal from '../components/ui/TaskModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function TaskBoard() {
  const { tasks, updateTask, deleteTask } = useData();
  const [boardData, setBoardData] = useState({ columns: {}, tasks: {}, columnOrder: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    const cols = {
      'todo': { id: 'todo', title: 'To Do', icon: Clock, taskIds: [] },
      'in-progress': { id: 'in-progress', title: 'In Progress', icon: Activity, taskIds: [] },
      'review': { id: 'review', title: 'Review', icon: AlertCircle, taskIds: [] },
      'blocked': { id: 'blocked', title: 'Blocked', icon: AlertCircle, taskIds: [] },
      'done': { id: 'done', title: 'Done', icon: CheckCircle2, taskIds: [] },
    };
    const tks = {};

    tasks.forEach(t => {
      tks[t._id] = t;
      if (cols[t.status]) cols[t.status].taskIds.push(t._id);
    });

    setBoardData({
      columns: cols,
      tasks: tks,
      columnOrder: ['todo', 'in-progress', 'review', 'blocked', 'done']
    });
  }, [tasks]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startColumn = boardData.columns[source.droppableId];
    const finishColumn = boardData.columns[destination.droppableId];

    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...startColumn, taskIds: newTaskIds };
      setBoardData({ ...boardData, columns: { ...boardData.columns, [newColumn.id]: newColumn } });
      return;
    }

    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...startColumn, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finishColumn.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finishColumn, taskIds: finishTaskIds };

    setBoardData({
      ...boardData,
      columns: { ...boardData.columns, [newStart.id]: newStart, [newFinish.id]: newFinish },
    });

    try {
      await updateTask(draggableId, { status: destination.droppableId });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = (status = 'todo') => {
    setEditingTask({ status });
    setIsModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
    setActiveMenu(null);
  };

  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'High': return { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
      case 'Medium': return { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
      case 'Low': return { color: 'text-muted-foreground', bg: 'bg-muted/10', border: 'border-muted/20' };
      default: return { color: 'text-muted-foreground', bg: 'bg-muted/10', border: 'border-muted/20' };
    }
  };

  return (
    <div className="theme-tasks h-full flex flex-col bg-subtle-mesh overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Task Board</h1>
          <p className="text-muted-foreground text-sm">Visual workflow for project execution.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert('Filtering coming soon!')}
            className="p-2 rounded-lg bg-surface-low border border-border/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Filter size={18} />
          </button>
          <button 
            onClick={() => handleCreate()}
            className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto pb-8 -mx-8 px-8 scrollbar-hide">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full items-start min-w-max">
            {boardData.columnOrder.map((columnId) => {
              const column = boardData.columns[columnId];
              const columnTasks = column.taskIds.map(taskId => boardData.tasks[taskId]);

              return (
                <div key={column.id} className="w-[320px] shrink-0 flex flex-col h-full max-h-full">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground/80">{column.title}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/40">
                        {columnTasks.length}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleCreate(column.id)}
                      className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto space-y-4 rounded-xl p-2 transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
                      >
                        {columnTasks.map((task, index) => {
                          const prio = getPriorityInfo(task.priority);
                          return (
                            <Draggable key={task._id} draggableId={task._id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => handleEdit(task)}
                                  className={`
                                    bg-surface-low border border-border/60 p-4 rounded-xl shadow-sm transition-all relative group cursor-pointer
                                    ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-primary/40 scale-[1.02] z-50 bg-surface-mid' : 'hover:border-primary/40 hover:shadow-md'}
                                  `}
                                >
                                  <div className="flex justify-between items-start mb-3">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${prio.bg} ${prio.color} ${prio.border}`}>
                                      {task.priority}
                                    </span>
                                    
                                    <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActiveMenu(activeMenu === task._id ? null : task._id);
                                        }}
                                        className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-secondary"
                                      >
                                        <MoreHorizontal size={14} />
                                      </button>
                                      
                                      <AnimatePresence>
                                        {activeMenu === task._id && (
                                          <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute right-0 mt-2 w-40 bg-surface-high border border-border/40 rounded-xl shadow-2xl z-50 overflow-hidden"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <button onClick={() => handleEdit(task)} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium hover:bg-secondary transition-colors text-left">
                                              <Edit2 size={12} /> Edit
                                            </button>
                                            <button onClick={() => handleDelete(task._id)} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors text-left">
                                              <Trash2 size={12} /> Delete
                                            </button>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  </div>
                                  
                                  <h4 className="font-bold text-sm mb-2 leading-tight group-hover:text-primary transition-colors">{task.title}</h4>
                                  
                                  <div className="flex items-center gap-3 text-muted-foreground mt-4 pt-3 border-t border-border/20">
                                    {task.dueDate && (
                                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                                        <Calendar size={12} />
                                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                      </div>
                                    )}
                                    <div className="flex-1" />
                                    {task.assignee && (
                                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[8px] font-bold border border-border/40 ring-1 ring-background" title={task.assignee.username}>
                                        {task.assignee.username.charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
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

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        task={editingTask && editingTask._id ? editingTask : null}
        defaultProjectId={editingTask?.project?._id || ''}
      />
    </div>
  );
}
