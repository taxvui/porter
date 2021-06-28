import React, { createContext, useReducer } from "react";
import { PorterFormData, PorterFormState, PorterFormAction } from "./types";

interface Props {
  formData: PorterFormData;
}

interface ContextProps {
  formData: PorterFormData;
  formState: PorterFormState;
  dispatchAction: (event: PorterFormAction) => void;
}

export const PorterFormContext = createContext<ContextProps | undefined>(
  undefined!
);
const { Provider } = PorterFormContext;

export const PorterFormContextProvider: React.FC<Props> = (props) => {
  const handleAction = (
    state: PorterFormState,
    action: PorterFormAction
  ): PorterFormState => {
    switch (action.type) {
      case "init-field":
        if (!(action.id in state.components)) {
          return {
            ...state,
            components: {
              ...state.components,
              [action.id]: {
                state: action.initValue,
                validation: {
                  ...{
                    error: false,
                    loading: false,
                    validated: false,
                    touched: false,
                  },
                  ...action.initValidation,
                },
              },
            },
          };
        }
        break;
      case "update-field":
        return {
          ...state,
          components: {
            ...state.components,
            [action.id]: {
              ...state.components[action.id],
              state: action.updateFunc(state.components[action.id]),
            },
          },
        };
      case "mutate-vars":
        return {
          ...state,
          variables: action.mutateFunc(state.variables),
        };
    }
    return state;
  };

  const [state, dispatch] = useReducer(handleAction, {
    components: {},
    variables: {},
  });

  return (
    <Provider
      value={{
        formData: props.formData,
        formState: state,
        dispatchAction: dispatch,
      }}
    >
      {props.children}
    </Provider>
  );
};
