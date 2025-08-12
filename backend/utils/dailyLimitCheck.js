const DAILY_LIMITS = require('../config/dailyLimits.js');

module.exports = function checkDailyLimit(user, amount) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //Reset if New day
    if ( !user.lastTransactionDate || user.lastTransactionDate < today ){
        user.dailyWithdrawn = 0;
    }

    const accountLimit = DAILY_LIMITS[user.accountType] || DAILY_LIMITS['Savings'];

    if(user.dailyWithdrawn + amount > accountLimit){
        return { allowed: false, remaining: accountLimit - user.dailyWithdrawn};
    }

    // Update usage
    user.dailyWithdrawn += amount;
    user.lastTransactionDate = new Date();

    return { allowed: true };
}