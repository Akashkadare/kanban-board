import { useCallback } from 'react';
import { ColumnType } from '../utils/enums';
import useTaskCollection from './useTaskCollection';
import { v4 as uuidv4 } from 'uuid';
import pickChakraRandomColor from '../helpers/pickChakraRandomColor';
import { TaskModel } from '../utils/models';
import { swap } from '../helpers/swap';

const MAX_TASK_PER_COLUMN = 12;

function useColumnTasks(column: ColumnType) {
  const [tasks, setTasks] = useTaskCollection();

  const columnTasks = tasks[column];

  const addEmptyTask = useCallback(() => {
    setTasks((allTasks) => {
      const columnTasks = allTasks[column];

      if (columnTasks.length > MAX_TASK_PER_COLUMN) {
        return allTasks;
      }

      const newColumnTask: TaskModel = {
        id: uuidv4(),
        title: `New ${column} task`,
        color: pickChakraRandomColor('.300'),
        column
      };

      return {
        ...allTasks,
        [column]: [newColumnTask, ...columnTasks]
      };
    });
  }, [column, setTasks]);

  const deleteTask = useCallback((id: TaskModel['id']) => {
    setTasks((allTasks) => {
      const columnTasks = allTasks[column];
      return {
        ...allTasks,
        [column]: columnTasks.filter((task) => task.id !== id)
      };
    });
  }, [column, setTasks]);

  const updatedTask = useCallback((
    id: TaskModel['id'], updatedTask: Omit<Partial<TaskModel>, 'id'>
  ) => {
    setTasks((allTasks) => {
      const columnTasks = allTasks[column];
      return {
        ...allTasks,
        [column]: columnTasks.map((task) => {
          task.id === id ? { ...task, ...updateTask } : task;
        })
      };
    });
  }, [column, setTasks]);

  const dropTaskFrom = useCallback(
    (from: ColumnType, id: TaskModel['id']) => {
      setTasks((allTasks) => {
        const fromColumnTasks = allTasks[from];
        const toColumnTasks = allTasks[column];
        const movingTask = fromColumnTasks.find((task) => task.id === id);

        if (!movingTask) {
          return allTasks;
        }

        return {
          ...allTasks,
          [from]: fromColumnTasks.filter((task) => task.id !== id),
          [column]: [{ ...movingTask, column }, ...toColumnTasks]
        };
      });
    }, [column, setTasks]);

  const swapTasks = useCallback(
    (i: number, j: number) => {
      setTasks((allTasks) => {
        const columnTasks = allTasks[column];
        return {
          ...allTasks,
          [column]: swap(columnTasks, i, j)
        };
      });
    }, [column, setTasks]);

  return {
    tasks: columnTasks,
    addEmptyTask,
    deleteTask,
    updatedTask,
    dropTaskFrom,
    swapTasks
  };
}

export default useColumnTasks;