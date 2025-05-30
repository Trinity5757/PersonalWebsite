import { NextResponse } from "next/server";

const catchAsync = (fn) => {
  return async (request, context) => {
    try {
      // Call the provided function and return the response
      return await fn(request, context);
    } catch (error) {
      // Log the error with additional context
      console.error("Error caught by catchAsync:", error);

      // Check if the error is a Mongoose validation error
      if (error.name === 'ValidationError') {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 }); // 400 for bad request
      }

      // Check for other known error types if necessary
      if (error.code === 11000) {
        return NextResponse.json({ success: false, message: "Duplicate key error" }, { status: 409 }); // 409 for conflict
      }

      // Fallback for other server errors
      return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
  };
};

export default catchAsync;
