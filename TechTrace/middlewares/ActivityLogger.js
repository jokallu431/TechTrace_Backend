const { ActivityLogModel }= require('../modules/activityLog')

const activityLogger = async (req, res, next) => {
    try {
        console.log("Inside activityLogger, req.userId:", req.userId);  // This should now log the userId

        // Use req.userId instead of req.users
        const userId = req.userId ? req.userId : 'Guest';
        const logEntry = new ActivityLogModel({
            userId: userId,
            timestamp: new Date(),
            requestBody: req.method === 'GET' ? {} : req.body // Avoid logging sensitive data
        });
        
        await logEntry.save();
        console.log('Activity logged:', logEntry);
    } catch (error) {
        console.error('Error logging activity:', error);
    }
    next();
};
module.exports = activityLogger;