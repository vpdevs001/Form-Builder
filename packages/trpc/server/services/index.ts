import UserService from "@repo/services/auth";
import FormService from "@repo/services/form";
import FormFieldService from "@repo/services/form-field";
import SubmissionService from "@repo/services/submission";
import SubmissionValueService from "@repo/services/submission-value";

export const userService = new UserService();
export const formService = new FormService();
export const formFieldService = new FormFieldService();
export const submissionService = new SubmissionService();
export const submissionValueService = new SubmissionValueService();
