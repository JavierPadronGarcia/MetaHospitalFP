const backendEndpoint = process.env.REACT_APP_BACKEND_URL;

export const webSocketEndpoint = process.env.REACT_APP_WS_URL;

export const backendImageEndpoint = `${backendEndpoint}/images`;

export const backendUsersEndpoint = `${backendEndpoint}/api/users`;

export const backendTeacherGroupEndpoint = `${backendEndpoint}/api/teachercourse`;

export const backendGroupsEndpoint = `${backendEndpoint}/api/groups`;

export const backendCoursesEndpoint = `${backendEndpoint}/api/courses`;

export const backendGroupEnrolementEndpoint = `${backendEndpoint}/api/groupenrolement`;

export const backendWorkUnitsEndpoint = `${backendEndpoint}/api/workunit`;

export const backendWorkUnitsColorsEndpoint = `${backendEndpoint}/api/workunitcolors`;

export const backendWorkUnitsGroupsEndpoint = `${backendEndpoint}/api/workunitgroups`;

export const backendExercisesEndpoint = `${backendEndpoint}/api/exercises`;

export const backendCasesEndpoint = `${backendEndpoint}/api/cases`;

export const backendMessagesEndpoint = `${backendEndpoint}/api/messages`;

export const backendSchoolsEndpoint = `${backendEndpoint}/api/schools`;

export const backendSubscriptionEndpoint = `${backendEndpoint}/api/activitysubscriptions`;