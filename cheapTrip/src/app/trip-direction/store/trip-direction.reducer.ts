import { IPath, Modes } from '../trip-direction.model';
import * as TripDirectionActions from './trip-direction.actions';

export interface ITripDirectionState {
  startPoint: string;
  endPoint: string;
  startPointAutoComplete: Array<{ id: number; name: string }>;
  endPointAutoComplete: Array<{ id: number; name: string }>;
  paths: IPath[];
  mode: Modes;
  errorMessage: string;
}

const initialState: ITripDirectionState = {
  startPoint: '',
  endPoint: '',
  startPointAutoComplete: [],
  endPointAutoComplete: [],
  paths: [],
  mode: Modes.SEARCH,
  errorMessage: '',
};

export function tripDirectionReducer(
  state = initialState,
  action: TripDirectionActions.TripDirectionActions
) {
  switch (action.type) {
    case TripDirectionActions.SET_START_POINT:
      return {
        ...state,
        startPoint: action.payload,
      };

    case TripDirectionActions.SET_END_POINT:
      return {
        ...state,
        startPoint: action.payload,
      };

    case TripDirectionActions.SET_START_POINT_AUTOCOMPLETE:
      return {
        ...state,
        startPointAutoComplete: action.payload,
      };

    case TripDirectionActions.SET_END_POINT_AUTOCOMPLETE:
      return {
        ...state,
        endPointAutoComplete: action.payload,
      };

    case TripDirectionActions.GET_START_POINT:
      return {
        ...state,
      };

    case TripDirectionActions.GET_END_POINT:
      return {
        ...state,
      };

    case TripDirectionActions.GET_AUTOCOMPLETE:
      return {
        ...state,
      };
    case TripDirectionActions.GET_ROUTS:
      return {
        ...state,
      };

    case TripDirectionActions.SET_ROUTS:
      return {
        ...state,
        paths: [...action.payload.paths],
        mode: Modes.DELIVERY,
      };

    case TripDirectionActions.AUTOCOMPLETE_FAIL:
      return {
        ...state,
        errorMessage: action.payload,
      };

    case TripDirectionActions.CLEAN_DATA:
      return {
        ...state,
        startPoint: '',
        endPoint: '',
        startPointAutoComplete: [],
        endPointAutoComplete: [],
        paths: [],
        mode: Modes.SEARCH,
        errorMessage: '',
      };

      case TripDirectionActions.SET_MODE:
        console.log('reducer');
      return {
        ...state,
        
        mode: action.payload,
       
      };

    default:
      return state;
  }
}
