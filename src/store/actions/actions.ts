import { createAction, props } from '@ngrx/store';
import * as Model from '../model/model';
export const LOAD_BASELIST = '[LOAD BASE] Baselist';
export const LOAD_MACHINELIST = '[LOAD MACHINE] Machinelist';
export const LOAD_PROCESSLIST = '[LOAD PROCESS] Processlist';
export const LOAD_TOOLSLIST_ACTION = '[LOAD TOOLS ACTION] ToolslistAction';
export const LOAD_TOOLSLIST_ANALYSIS = '[LOAD TOOLS ANALYSIS] ToolslistAnalysis';
export const LOAD_TOOLSLIST_AWARENESS = '[LOAD TOOLS AWARENESS] ToolslistAwareness';
export const LOAD_TOOLSLIST_RESULT = '[LOAD TOOLS RESULT] ToolslistResult';
export const LOAD_SST_MASTER = '[LOAD SST MASTERLIST] SSTMasterList';
export const LOAD_SST_EDIT_REPLY_FILES = '[LOAD REPLY FILES] SST ReplyFiles';
export const SELECT_SST_EDIT = '[EDIT SST] Edit';
export const LOAD_USER_INFO = '[LOAD USERINFO] Info';
export const SET_USER_SIGNIN = '[SET SIGNIN] Set';
export const SELECT_SST_EDIT_REPLY = '[EDIT REPLY] Edit';
export const LOAD_REGISTRATION_LIST = '[LOAD REGISTERLIST] Load list';
export const LOAD_PROGRESS_SELECT_LIST = '[LOAD PROGRESSSLIST] Load SelectList';
export const LOAD_TOOLS_USED_LIST = '[LOAD TOOLS USED] Load ToolsUsedList';
export const LOAD_ACTIVITY_LIST ='[LOAD ACTIVITY LIST]Load Activity';
export const LOAD_ACTIVITY_LIST_GROUP ='[LOAD ACTIVITY LIST GROUP]Load ActivityGroup';

export const LoadBaseList = createAction(LOAD_BASELIST,
  props<{ payload: Model.IBase[]}>());

export const LoadMachineList = createAction(LOAD_MACHINELIST,
  props<{ payload: Model.MachineList[]}>());

export const LoadProcessList = createAction(LOAD_PROCESSLIST,
  props<{ payload: Model.ProcessList[]}>());

export const LoadToolsListAction = createAction(LOAD_TOOLSLIST_ACTION,
  props<{ payload: Model.ToolsListAction[]}>());

export const LoadToolsListAnalysis = createAction(LOAD_TOOLSLIST_ANALYSIS,
  props<{ payload: Model.ToolsListAnalysis[]}>());

export const LoadToolsListAwareness = createAction(LOAD_TOOLSLIST_AWARENESS,
  props<{ payload: Model.ToolsListAwareness[]}>());

export const LoadToolsListResult = createAction(LOAD_TOOLSLIST_RESULT,
  props<{ payload: Model.ToolsListResult[]}>());

export const LoadSSTMasterList = createAction(LOAD_SST_MASTER,
  props<{ payload: Model.SSTMasterList[]}>());

export const SelectSSTEdit = createAction(SELECT_SST_EDIT,
  props<{ payload: Model.SSTMasterList[]}>());

export const LoadUserInfo = createAction(LOAD_USER_INFO,
    props<{ payload: Model.UserInfo[]}>());

export const SetUserSignin = createAction(SET_USER_SIGNIN,
    props<{ payload: boolean}>());

export const SelectSSTEditReply = createAction(SELECT_SST_EDIT_REPLY,
  props<{ payload: Model.SSTReply[]}>());

export const LoadSSTEditReplyFiles = createAction(LOAD_SST_EDIT_REPLY_FILES,
  props<{ payload: Model.SSTFilesReply[]}>());

export const LoadRegistrationList = createAction(LOAD_REGISTRATION_LIST,
  props<{ payload: Model.RegistrationDropList}>());

export const LoadSelectProgressList = createAction(LOAD_PROGRESS_SELECT_LIST,
  props<{ payload: Model.ProgressSelectList[]}>());

export const LoadToolsUsedList = createAction(LOAD_TOOLS_USED_LIST,
  props<{ payload: Model.ToolsUsedList[]}>());

export const LoadActivityList = createAction(LOAD_ACTIVITY_LIST,
  props<{ payload: Model.ActivityList[]}>());

export const LoadActivityListGroup = createAction(LOAD_ACTIVITY_LIST_GROUP,
  props<{ payload: Model.ActivityListGroup[]}>());
