import { notification, message } from "antd";
import { useTranslation } from "react-i18next";

const useNotification = () => {
  const [t] = useTranslation('global');

  const noConnectionError = () => {
    notification.error({
      message: t('netwotk_error_title'),
      description: t('network_error_description'),
      placement: 'top',
    });
  }

  const errorOnLogin = () => {
    notification.error({
      message: t('login_error_title'),
      description: t('login_error_description'),
      placement: 'top',
      duration: 5
    });
  }

  const errorMessage = (message, description) => {
    notification.error({
      message: message,
      description: description,
      placement: 'top',
      duration: 5
    });
  }

  const schoolCreateFail = () => {
    message.error(t("school_create_fail"));
  }

  const schoolGetFail = () => {
    message.error(t('school_request_fail'));
  }

  const noNameError = () => {
    message.error(t("no_name_error"));
  }

  const schoolStudentsGetError = () => {
    message.error(t('school_student_get_fail'))
  }

  const schoolTeacherGetError = () => {
    message.error(t('school_teacher_get_fail'))
  }

  const usersGetError = () => {
    message.error(t('users_get_fail'))
  }

  const userUpdatedSuccessfully = () => {
    message.error(t('user_update_successfull'))
  }

  const userDeletedSuccessfully = () => {
    message.error(t('user_delete_successfull'))
  }

  const userDeleteFailed = () => {
    message.error(t('user_delete_failed'));
  }

  const userCreateSuccessful = () => {
    message.error(t('user_create_successfull'));
  }

  const userUpdateOrCreateFail = () => {
    message.error(t('user_update_create_fail'));
  }

  const groupGetError = () => {
    message.error(t('group_get_fail'));
  }

  const courseGetError = () => {
    message.error(t('course_get_fail'));
  }

  const groupDeleteSuccessful = () => {
    message.error(t('group_delete_successful'))
  }

  const groupDeleteFail = () => {
    message.error(t('group_delete_fail'))
  }

  const groupCreateSuccessful = () => {
    message.error(t('group_create_successful'))
  }

  const groupUpdateSuccessful = () => {
    message.error(t('group_update_successful'))
  }

  const groupUpdateOrCreateFail = () => {
    message.error(t('group_update_create_fail'))
  }

  const courseDeleteSuccessful = () => {
    message.error(t('course_delete_successful'))
  }

  const courseDeleteFail = () => {
    message.error(t('course_delete_fail'))
  }

  const courseCreateSuccessful = () => {
    message.error(t('course_create_successful'))
  }

  const courseUpdateOrCreateFail = () => {
    message.error(t('course_update_create_fail'))
  }

  return {
    noConnectionError,
    errorOnLogin,
    errorMessage,
    schoolCreateFail,
    schoolGetFail,
    noNameError,
    schoolStudentsGetError,
    usersGetError,
    userDeletedSuccessfully,
    userDeleteFailed,
    userUpdatedSuccessfully,
    userCreateSuccessful,
    userUpdateOrCreateFail,
    schoolTeacherGetError,
    groupGetError,
    courseGetError,
    groupDeleteSuccessful,
    groupDeleteFail,
    groupCreateSuccessful,
    groupUpdateOrCreateFail,
    courseCreateSuccessful,
    courseDeleteFail,
    courseDeleteSuccessful,
    courseUpdateOrCreateFail,
    groupUpdateSuccessful
  };
}

export default useNotification;