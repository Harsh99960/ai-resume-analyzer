import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/file.middleware.js";
import {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController,

} from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

/**
 * @route POST /api/interview
 * @description generate new interview report onn the basis of user Self description, resume
 * and job description
 * @access private 
 */

interviewRouter.post(
    "/",
    authMiddleware.authUser,
    upload.single("resume"),
    generateInterviewReportController
);

/**
 * @route :get/api/interview/report/:interviewId
 * @description:get interview Report by interview id
 * @access:private
 */

interviewRouter.get(
    "/report/:interviewId",
    authMiddleware.authUser,
    getInterviewReportByIdController
);

/**
 * @route :get/api/interview
 * @description:get all interview Report of logged in user
 * @access:private
 */

interviewRouter.get(
    "/",
    authMiddleware.authUser,
    getAllInterviewReportsController
);

/**
 * @route : GET /api/interview/resume/pdf
 * @description : generate resume pdf on the basis of user self job desc and resume
 * @access : private
 */

interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser , generateResumePdfController)

export default interviewRouter;