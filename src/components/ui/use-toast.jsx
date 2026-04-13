// Inspired by react-hot-toast library
import { useState, useEffect } from "react";

const TOAST_LIMIT = 20;
const TOAST_AUTO_DISMISS_DELAY = 2000;
const TOAST_REMOVE_DELAY = 300;

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toastRemoveTimeouts = new Map();
const toastDismissTimeouts = new Map();

const clearQueuedTimeout = (queue, toastId) => {
  const timeout = queue.get(toastId);
  if (timeout) {
    clearTimeout(timeout);
    queue.delete(toastId);
  }
};

const addToDismissQueue = (toastId) => {
  if (toastDismissTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastDismissTimeouts.delete(toastId);
    dispatch({
      type: actionTypes.DISMISS_TOAST,
      toastId,
    });
  }, TOAST_AUTO_DISMISS_DELAY);

  toastDismissTimeouts.set(toastId, timeout);
};

const addToRemoveQueue = (toastId) => {
  if (toastRemoveTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastRemoveTimeouts.delete(toastId);
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastRemoveTimeouts.set(toastId, timeout);
};

const _clearFromRemoveQueue = (toastId) => {
  clearQueuedTimeout(toastRemoveTimeouts, toastId);
  clearQueuedTimeout(toastDismissTimeouts, toastId);
};

export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        _clearFromRemoveQueue(toastId);
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          _clearFromRemoveQueue(toast.id);
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        state.toasts.forEach((toast) => _clearFromRemoveQueue(toast.id));
        return {
          ...state,
          toasts: [],
        };
      }
      _clearFromRemoveQueue(action.toastId);
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners = [];

let memoryState = { toasts: [] };

function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function findDuplicateToast(props) {
  return memoryState.toasts.find((item) => {
    if (!item.open) return false;

    return (
      item.title === props.title &&
      item.description === props.description &&
      item.variant === props.variant
    );
  });
}

function toast({ ...props }) {
  const duplicate = findDuplicateToast(props);

  if (duplicate) {
    _clearFromRemoveQueue(duplicate.id);

    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: {
        ...duplicate,
        ...props,
        id: duplicate.id,
        open: true,
        onOpenChange: (open) => {
          if (!open) {
            dispatch({
              type: actionTypes.DISMISS_TOAST,
              toastId: duplicate.id,
            });
          }
        },
      },
    });

    addToDismissQueue(duplicate.id);

    return {
      id: duplicate.id,
      dismiss: () =>
        dispatch({ type: actionTypes.DISMISS_TOAST, toastId: duplicate.id }),
      update: (nextProps) =>
        dispatch({
          type: actionTypes.UPDATE_TOAST,
          toast: { ...nextProps, id: duplicate.id },
        }),
    };
  }

  const id = genId();

  const update = (props) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    });

  const dismiss = () =>
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  addToDismissQueue(id);

  return {
    id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = useState(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}

export { useToast, toast }; 
