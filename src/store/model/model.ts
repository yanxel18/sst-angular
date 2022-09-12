export interface SSTState {
  DropList: {
    BaseList: IBase[] | [],
    MachineList: MachineList[] | [],
    ProcessList: ProcessList[] | []
  },
  ToolsList: {
    ToolsListAction: ToolsListAction[] | [],
    ToolsListAnalysis: ToolsListAnalysis[] | [],
    ToolsListAwareness: ToolsListAwareness[] | [],
    ToolsListResult: ToolsListResult[] | []
  },
  ActivityList: ActivityList[] | [],
  ActivityListGroup: ActivityListGroup[] | [],
  ProgressStatusList: ProgressSelectList[] | [],
  ToolsUsedList: ToolsUsedList[] | [],
  SSTMasterList: SSTMasterList[] | [],
  SelectedEditSST: SSTMasterList[] | [],
  SelectedEditSSTReply: SSTReply[] | [],
  SelectedEditSSTReplyFiles: SSTFilesReply[] | []
  Title: string | null,
  UserSignIn: boolean,
  UserInfo: UserInfo[],
  RegistrationDropList: RegistrationDropList
}

export interface IBase {
  stb_base_id: number | null,
  stb_base_desc: string | '',
  stb_pgroup_id: number | null,
  stg_description: string | ''
}

export interface ISSTForm {
  sstid?: number,
  documentNumber?: string | null,
  applyDate?: string,
  baseID?: number | null,
  userFullName?: string | '',
  userGID?: number | null,
  emailTxt?: string | ''
  localNumberTxt?: string | null,
  lunchDate?: string | null,
  startDate?: string | null,
  endDate?: string | null,
  conditionTxt?: string | '',
  machineListID?: number | undefined | null,
  machineListTxt?: string | '',
  processListID?: number | undefined | null,
  processListTxt?: string | '',
  activityListTxt?: number | null,
  expectedEffectTxt?: string | '',
  awarenessToolID?: number | undefined | null,
  awarenessToolListTxt?: string | '',
  awarenessTxt?: string | '',
  analysisToolID?: number | undefined | null,
  analysisToolListTxt?: string | '',
  analysisTxt?: string | '',
  actionToolID?: number | undefined | null,
  actionToolListTxt?: string | '',
  actionTxt?: string | '',
  resultToolID?: number | undefined | null,
  resultToolListTxt?: string | '',
  resultTxt?: string | '',
  modifiedbygid?: number | undefined | null
}


export interface MachineList {
  sml_machine_id: number | null,
  sml_machine_desc: string | '',
  sml_createdby_gid: string | ''
}

export interface ProcessList {
  sp_process_id: number | null,
  sp_process_desc: string | '',
  sp_createdby_gid: string | ''
}

export interface ToolsListAction {
  sta_tool_id: number | null,
  sta_tool_desc: string | '',
  sta_createdby_gid: string | ''
}

export interface ToolsListAnalysis {
  sts_tool_id: number | null,
  sts_tool_desc: string | '',
  sts_createdby_gid: string | ''
}


export interface ToolsListAwareness {
  stl_tool_id: number | null,
  stl_tool_desc: string | '',
  stl_createdby_gid: string | ''
}


export interface ToolsListResult {
  str_tool_id: number | null,
  str_tool_desc: string | '',
  str_createdby_gid: string | null
}

export interface DataResult {
  result: string
}
export interface ReasonList {
  reasonID?: number,
  reasonDesc?: string
}
export interface SSTMasterList extends SSTEdit {
  sst_num?: number,
  sst_id?: number,
  sst_doc_number?: string,
  sst_apply_date: string,
  sst_progress_id?: number,
  sp_progress_status?: string,
  sst_base_id?: number,
  stb_base_name?: string,
  sst_gid?: number,
  su_fullname?: string,
  su_email?: string,
  su_local_phone?: string,
  sst_fullname?: string,
  sst_email?: string,
  sst_local_phone: string,
  sst_schedulestart_date: string,
  sst_scheduleend_date?: string,
  sst_completed_date?: string,
  sst_deployment_demand?: string,
  sst_process_id?: number,
  sp_process_desc?: string,
  sst_machine_id?: number,
  sml_machine_desc?: string,
  sst_activity_content?: string,
  sst_expected_effect?: string,
  sst_tools_used?: string,
  sst_awareness_tool_id?: number,
  stl_awarenesstool?: string,
  sst_awareness_content?: string,
  sst_analysis_tool_id?: number,
  sts_analysistool?: string,
  sst_analysis_content?: string,
  sst_action_tool_id?: number,
  sta_actiontool?: string
  sst_action_content?: string,
  sst_result_tool_id?: number,
  str_resulttool?: string,
  sst_result_content?: string,
  sst_created_date?: string,
  sst_createdby_gid?: number,
  sst_modified_date?: string,
  sst_modifiedby_gid?: number,
  sst_activity_content_id?: number,
  sstreply: SSTReply[],
  sstfiles?: SSTFiles[]
}
export interface SSTFilesReply {
  sar_id?: number,
  sar_sst_reply_id?: number,
  sar_filename?: string,
  sar_file_directory?: string,
  sar_filesize?: number,
  sar_created_date?: string,
}
export interface SSTFiles {
  sa_id?: number,
  sa_sst_id?: number,
  sa_filename?: string,
  sa_file_directory?: string,
  sa_filesize?: number,
  sa_created_date?: string,
}
export interface SSTReply {
  str_sst_id?: number,
  str_reply_rowid?: number,
  str_schedulestart_date: string,
  str_scheduleend_date?: string,
  str_completed_date?: string,
  str_progress_id?: number,
  str_base_id?: number,
  stb_base_desc?: string,
  sp_progress_desc?: string,
  str_reasonID?: number,
  str_remarks?: string,
  sp_icon?: string
  str_created_byname?: string,
  str_createdby_gid?: number,
  str_filecount: number
}
export interface FormSize {
  dialogMinWidth?: string,
  dialogWidth?: string,
  dialogHeight?: string,
  dialogMinHeight?: string,
  dialogMaxWidth?: string,
  dialogMaxHeight?: string
}
export interface SSTFormReply {
  sstid?: number,
  usernametxt?: string,
  emailtxt?: string,
  localNumberTxt?: string,
  progressComboID?: number,
  progressReasonID?: number,
  lunchDate?: string,
  startDate?: string,
  endDate?: string | null,
  remarks?: string,
  gid?: number,
  rownumber?: number
}


export interface SSTEdit {
  su_email?: string,
  su_local_phone?: string,
  su_editbygid?: number
  su_editDate?: string
}


export interface SSTAttachment {
  name: string,
  size: number
}

export interface LoginInterface {
  usergid: string,
  userpass: string
}

export interface TokenInterface {
  token: string
}

export interface UserInfo {
  su_gid?: number,
  su_gid_full?: string,
  stb_base_desc?: string,
  su_fullname?: string,
  su_email?: string,
  su_acclvl_id: number,
  su_base_id: number,
  su_pgroup_id?: number,
  su_local_phone?: string,
  st_acclvl_desc?: string,
  stg_description?: string,
  su_access_rights: AccessRights[]
}

export interface AccessRights {
  sar_acclvl_id?: number,
  sar_sst_create?: number,
  sar_sst_read?: number,
  sar_sst_update?: number,
  sar_sst_delete?: number,
  sar_acc_create?: number,
  sar_acc_read?: number,
  sar_acc_update?: number,
  sar_acc_delete?: number,
  sar_base_create?: number,
  sar_base_read?: number,
  sar_base_update?: number,
  sar_base_delete?: number
}
export interface RegistrationDropList {
  BaseList: BaseList[],
  ProcessGroupList: ProcessGroupList[],
  AccessLevelList: AccessLevelList[]
}

export interface BaseList {
  stb_base_id: number,
  stb_base_desc: string
  stg_pgroup_id: number,
  stg_description: string
}

export interface ProcessGroupList {
  stg_pgroup_id: number,
  stg_description: string
}

export interface AccessLevelList {
  st_acclvl_id: number,
  st_acclvl_desc: string
}

export interface RegisterUserInfo {
  accesslvlID?: number,
  baseNameID?: number,
  emailAdd?: string,
  fullName?: string,
  gidFull?: string,
  localNumber?: string,
  passwordA?: string,
  passwordB?: string,
  productionID?: number,
  gid?: number
}

export interface CreateBase {
  basename?: string,
  prodID?: number,
  createdbygid?: number
}

export interface ProgressSelectList{
  sp_progress_id: number,
  sp_progress_desc: string,
  sp_progress_icon: string
}
export interface UpdateBase {
  baseID?: number,
  basename?: string,
  prodID?: number,
  createdbygid?: number
}
export interface ToolsUsedList{
  sst_tools_used: string
}

export interface SSTExportListCSV{
  dateFrom?: string,
  dateTo?: string,
  docNumber?: string,
  baseID?: string,
  progressID?: string,
  processID?: string,
  usedTool?: string
}
export interface ActivityList {
  stc_id: number,
  stc_content_desc: string,
  stg_active: number,
  stc_group_id: number,
}
export interface UpdateActivity{
  activitydesc?: string,
  activityid?: string,
  updatedbygid?: number
}

export interface CreateActivity{
  activitydesc?: string,
  activityid?: string,
  groupID?: number,
  createdbygid?: number
}

export interface ActivityListGroup {
  stg_id: number,
  stg_group: string,
  stg_active: number
}

export interface enableActivityList {
  groupID: number,
  updatedbygid?: number
}

export interface createGroupActivityParam {
  groupName: string,
  createdbygid?: number
  existing?: string
}

export interface updateActivityGroupParam {
  groupName: string,
  groupID: number,
  updatedbygid?: number
  existing?: string
}
