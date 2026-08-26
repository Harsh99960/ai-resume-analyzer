import mongoose from "mongoose";

const technicalQuestionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "Technical Question is required"],
        },

        intention: {
            type: String,
            required: [true, "Intention Question is required"],
        },

        answer: {
            type: String,
            required: [true, "Answer is required"],
        },
    },
    {
        _id: false,
    }
);

const behavioralQuestionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "Behavioral Question is required"],
        },

        intention: {
            type: String,
            required: [true, "Intention Question is required"],
        },

        answer: {
            type: String,
            required: [true, "Answer is required"],
        },
    },
    {
        _id: false,
    }
);

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"],
    },

    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is required"],
    },
});

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"],
    },

    focus: {
        type: String,
        required: [true, "Focus is required"],
    },

    tasks: [
        {
            type: String,
            required: [true, "Task is required"],
        },
    ],
});

const interviewReportSchema = new mongoose.Schema(
    {
        matchScore: {
            type: Number,
            min: 0,
            max: 100,
        },

        selfDescription: {
            type: String,
        },

        resume: {
            type: String,
        },

        jobDescription: {
            type: String,
            required: [true, "Job description is required!!"],
        },

        title: {
            type: String,
            required: [true, "Job title is required!!"],
        },

        technicalQuestions: [technicalQuestionSchema],

        behavioralQuestions: [behavioralQuestionSchema],

        skillGap: [skillGapSchema],

        preparationPlan: [preparationPlanSchema],

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
    },
    {
        timestamps: true,
    }
);

const interviewReportModel = mongoose.model(
    "interviewReport",
    interviewReportSchema
);

export default interviewReportModel;