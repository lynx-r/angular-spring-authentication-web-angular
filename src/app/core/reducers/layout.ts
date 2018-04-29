import * as layout from '../actions/layout';

export interface LayoutState {
  showSidenav: any;
}

const initialState: LayoutState = {
  showSidenav: null,
};

export function layoutReducer(state = initialState, action: layout.Actions): LayoutState {
  switch (action.type) {
    case layout.OPEN_SIDENAV:
      return {
        showSidenav: action.payload,
      };

    default:
      return state;
  }
}

export const getLayoutShowSidenav = (state: LayoutState) => state.showSidenav;
