const sequelize = require("./sequelize");
const ChatMessage = require("./models/ChatMessage");
const ChatRoom = require("./models/ChatRoom");
const ChatUser = require("./models/ChatUser");
const SiteVisit = require("./models/SiteVisit");
const SiteVisitor = require("./models/SiteVisitor");
const Registration = require("./models/Registration");
const Event = require("./models/Event");
const PageModel = require("./models/PageModel");
const PageSection = require("./models/PageSection");
const Account = require("./models/Account");
const Communication = require("./models/Communication");
const EmailListRecipient = require("./models/EmailListRecipient");
const RegistrationForm = require("./models/RegistrationForm");

ChatMessage.belongsTo(ChatUser);
ChatMessage.belongsTo(ChatRoom);

ChatRoom.hasMany(ChatMessage);
ChatUser.hasMany(ChatMessage);
ChatUser.belongsTo(ChatRoom);
ChatRoom.hasMany(ChatUser);

SiteVisit.belongsTo(SiteVisitor);
SiteVisitor.hasMany(SiteVisit);

SiteVisit.belongsTo(Event);
Event.hasMany(SiteVisit);

SiteVisitor.belongsTo(Event);
Event.hasMany(SiteVisitor);

Registration.hasMany(SiteVisitor);
SiteVisitor.belongsTo(Registration);
Event.hasMany(Registration);
Registration.belongsTo(Event);

Event.belongsTo(Account);
Account.hasMany(Event);

Event.belongsTo(PageModel, { as: "EventPageModel" });
Event.belongsTo(PageModel, { as: "RegPageModel" });

PageModel.hasMany(PageSection);
PageSection.belongsTo(PageModel);

Communication.belongsTo(Event);
Event.hasMany(Communication);

EmailListRecipient.belongsTo(Communication);
Communication.hasMany(EmailListRecipient);

RegistrationForm.belongsTo(Event);
Event.hasMany(RegistrationForm);

//sequelize.sync({ alter: true });
//SiteVisitor.sync({ alter: true });
/*
ChatUser.sync({ alter: true });
ChatRoom.sync({ alter: true });
ChatMessage.sync({ alter: true });
*/
/*
SiteVisit.sync({ alter: true });
SiteVisitor.sync({ alter: true });
Registration.sync({ alter: true });
*/

module.exports = {
  sequelize,
  models: {
    ChatMessage,
    ChatRoom,
    ChatUser,
    SiteVisit,
    SiteVisitor,
    Registration,
    Event,
    PageModel,
    PageSection,
    Account,
    Communication,
    EmailListRecipient,
    RegistrationForm,
  },
};
