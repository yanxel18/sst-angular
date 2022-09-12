import { createReducer, on } from '@ngrx/store';
import * as SSTActions from '../actions/actions';
import { SSTState } from '../model/model';

export const initialState: SSTState = {
  DropList: {
    BaseList: [],
    MachineList: [],
    ProcessList: []
  },
  ToolsList: {
    ToolsListAction: [],
    ToolsListAwareness: [],
    ToolsListAnalysis: [],
    ToolsListResult: []
  },
  ActivityList: [],
  ActivityListGroup: [],
  ProgressStatusList: [],
  ToolsUsedList: [],
  SSTMasterList: [],
  SelectedEditSST: [],
  SelectedEditSSTReply: [],
  SelectedEditSSTReplyFiles: [],
  Title: 'SSTSystem',
  UserSignIn: false,
  UserInfo: [],
  RegistrationDropList: {
    BaseList: [],
    ProcessGroupList: [],
    AccessLevelList: []
  }
};

export const reducer = createReducer(
  initialState,
  on(SSTActions.LoadBaseList, (state, { payload }) => ({
    ...state,
    DropList: {
      BaseList: payload,
      MachineList: state.DropList.MachineList,
      ProcessList: state.DropList.ProcessList
    }
  })),
  on(SSTActions.LoadMachineList, (state, { payload }) => ({
    ...state,
    DropList: {
      BaseList: state.DropList.BaseList,
      MachineList: payload,
      ProcessList: state.DropList.ProcessList
    }
  })),
  on(SSTActions.LoadProcessList, (state, { payload }) => ({
    ...state,
    DropList: {
      BaseList: state.DropList.BaseList,
      MachineList: state.DropList.MachineList,
      ProcessList: payload
    }
  })),
  on(SSTActions.LoadToolsListAction, (state, { payload }) => ({
    ...state,
    ToolsList: {
      ToolsListAwareness: state.ToolsList.ToolsListAwareness,
      ToolsListAnalysis: state.ToolsList.ToolsListAnalysis,
      ToolsListResult: state.ToolsList.ToolsListResult,
      ToolsListAction: payload
    }
  })),
  on(SSTActions.LoadToolsListAwareness, (state, { payload }) => ({
    ...state,
    ToolsList: {
      ToolsListAwareness: payload,
      ToolsListAnalysis: state.ToolsList.ToolsListAnalysis,
      ToolsListResult: state.ToolsList.ToolsListResult,
      ToolsListAction: state.ToolsList.ToolsListAction
    }
  })),
  on(SSTActions.LoadToolsListAnalysis, (state, { payload }) => ({
    ...state,
    ToolsList: {
      ToolsListAwareness: state.ToolsList.ToolsListAwareness,
      ToolsListAnalysis: payload,
      ToolsListResult: state.ToolsList.ToolsListResult,
      ToolsListAction: state.ToolsList.ToolsListAction
    }
  })),
  on(SSTActions.LoadToolsListResult, (state, { payload }) => ({
    ...state,
    ToolsList: {
      ToolsListAwareness: state.ToolsList.ToolsListAwareness,
      ToolsListAnalysis: state.ToolsList.ToolsListAnalysis,
      ToolsListResult: payload,
      ToolsListAction: state.ToolsList.ToolsListAction
    }
  })),
  on(SSTActions.LoadSSTMasterList, (state, { payload }) => ({
    ...state,
    SSTMasterList: payload
  })),
  on(SSTActions.SelectSSTEdit, (state, { payload }) => ({
    ...state,
    SelectedEditSST: payload
  })),
  on(SSTActions.LoadUserInfo, (state, { payload }) => ({
    ...state,
    UserInfo: payload
  })),
  on(SSTActions.SetUserSignin, (state, { payload }) => ({
    ...state,
    UserSignIn: payload
  })),
  on(SSTActions.SelectSSTEditReply, (state, { payload }) => ({
    ...state,
    SelectedEditSSTReply: payload
  })),
  on(SSTActions.LoadSSTEditReplyFiles, (state, { payload }) => ({
    ...state,
    SelectedEditSSTReplyFiles: payload
  })),
  on(SSTActions.LoadRegistrationList, (state, { payload }) => ({
    ...state,
    RegistrationDropList: payload
  })),
  on(SSTActions.LoadSelectProgressList, (state, { payload }) => ({
    ...state,
    ProgressStatusList: payload
  })),
  on(SSTActions.LoadToolsUsedList, (state, { payload }) => ({
    ...state,
    ToolsUsedList: payload
  })),
  on(SSTActions.LoadActivityList, (state, { payload }) => ({
    ...state,
    ActivityList: payload
  })),
  on(SSTActions.LoadActivityListGroup, (state, { payload }) => ({
    ...state,
    ActivityListGroup: payload
  }))




)
