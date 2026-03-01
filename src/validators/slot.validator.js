const ApiError = require('../utils/ApiError');

exports.validateSlotInput = ({ startTime, endTime, slotDuration }) => {

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new ApiError(400, 'Invalid start or end time');
  }

  if (start >= end) {
    throw new ApiError(400, 'Start time must be before end time');
  }

  if (!Number.isInteger(slotDuration) || slotDuration <= 0) {
    throw new ApiError(400, 'Slot duration must be a positive integer');
  }

  const diffMinutes = (end - start) / (1000 * 60);

  if (diffMinutes < slotDuration) {
    throw new ApiError(400, 'Slot duration exceeds total range');
  }

  if (diffMinutes % slotDuration !== 0) {
    throw new ApiError(
      400,
      'Time range must be divisible by slot duration'
    );
  }
};