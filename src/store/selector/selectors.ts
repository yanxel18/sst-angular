import { createSelector, createFeatureSelector } from "@ngrx/store";
import * as SSTModel from '../model/model';

export const getSSTState = createFeatureSelector<SSTModel.SSTState>('SSTState');

export const getBaseList = createSelector(getSSTState, (state: SSTModel.SSTState) => state.DropList.BaseList);

export const getMachineList = createSelector(getSSTState, (state: SSTModel.SSTState) => state.DropList.MachineList);

export const getProcessList = createSelector(getSSTState, (state: SSTModel.SSTState) => state.DropList.ProcessList);

export const getToolsListAction = createSelector(getSSTState, (state: SSTModel.SSTState) => state.ToolsList.ToolsListAction);

export const getToolsListAnalysis = createSelector(getSSTState, (state: SSTModel.SSTState) => state.ToolsList.ToolsListAnalysis);

export const getToolsListAwareness = createSelector(getSSTState, (state: SSTModel.SSTState) => state.ToolsList.ToolsListAwareness);

export const getToolsListResult = createSelector(getSSTState, (state: SSTModel.SSTState) => state.ToolsList.ToolsListResult);

export const getSSTMasterList = createSelector(getSSTState, (state: SSTModel.SSTState) => state.SSTMasterList);

export const getSelectedSST = createSelector(getSSTState, (state: SSTModel.SSTState) => state.SelectedEditSST);

export const getUserSignIn = createSelector(getSSTState, (state: SSTModel.SSTState) => state.UserSignIn);

export const getUserInfo = createSelector(getSSTState, (state: SSTModel.SSTState) => state.UserInfo);

export const getSelectedSSTEdit = createSelector(getSSTState, (state: SSTModel.SSTState) => state.SelectedEditSSTReply);

export const getSelectedSSTEditReplyFiles = createSelector(getSSTState, (state: SSTModel.SSTState) => state.SelectedEditSSTReplyFiles);

export const getRegistrationDropList = createSelector(getSSTState, (state: SSTModel.SSTState) => state.RegistrationDropList);

export const getSelectProgressList = createSelector(getSSTState, (state: SSTModel.SSTState) => state.ProgressStatusList);

export const getToolsUsedList = createSelector(getSSTState, (state: SSTModel.SSTState) => state.ToolsUsedList);

export const getActivityList = createSelector(getSSTState, (state: SSTModel.SSTState) => state.ActivityList);

export const getActivityListGroup = createSelector(getSSTState, (state: SSTModel.SSTState) => state.ActivityListGroup);
