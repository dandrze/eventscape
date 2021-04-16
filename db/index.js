const { sequelizeRedis } = require("../services/sequelizeRedis");

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
const ChatQuestion = require("./models/ChatQuestion");
const Poll = require("./models/Poll");
const PollOption = require("./models/PollOption");
const PollResponse = require("./models/PollResponse");
const Permission = require("./models/Permission");
const Plan = require("./models/Plan");
const PlanType = require("./models/PlanType");
const InvoiceLineItem = require("./models/InvoiceLineItem");
const Invoice = require("./models/Invoice");
const CustomLineItem = require("./models/CustomLineItem");

ChatMessage.belongsTo(ChatUser);
ChatMessage.belongsTo(ChatRoom);

ChatRoom.hasMany(ChatMessage);
ChatUser.hasMany(ChatMessage);
ChatUser.belongsTo(ChatRoom);
ChatRoom.hasMany(ChatUser);

ChatQuestion.belongsTo(ChatRoom);
ChatQuestion.belongsTo(ChatUser);
ChatRoom.hasMany(ChatQuestion);
ChatUser.hasMany(ChatQuestion);

ChatUser.belongsTo(Registration);
Registration.hasMany(ChatUser);
ChatUser.belongsTo(Account);
Account.hasMany(ChatUser);

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

// new multi account mapping
Permission.belongsTo(Event);
Permission.belongsTo(Account);
Event.belongsTo(Account, { as: "Owner" });

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

Poll.belongsTo(Event);
Event.hasMany(Poll);

PollOption.belongsTo(Poll);
Poll.hasMany(PollOption);

PollResponse.belongsTo(SiteVisitor);
PollResponse.belongsTo(PollOption);

InvoiceLineItem.belongsTo(Plan);
InvoiceLineItem.belongsTo(CustomLineItem);

InvoiceLineItem.belongsTo(Invoice);
Invoice.hasMany(InvoiceLineItem);

Plan.belongsTo(PlanType);
PlanType.hasMany(Plan);

Invoice.belongsTo(Event);
Event.hasMany(Invoice);

Plan.belongsTo(Event);
Event.hasOne(Plan);

//Plan.sync({ alter: true });
//PageSection.sync({ alter: true });
//Account.sync({ alter: true });
//Event.sync({ alter: true });

/* Poll.sync({ alter: true });
PollOption.sync({ alter: true });
PollResponse.sync({ alter: true });
SiteVisitor.sync({ alter: true }); */

//Registration.sync({ alter: true });
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

// any models wrapped with sequelizeRedis can be used with redis caching
module.exports = {
  sequelize,
  models: {
    ChatMessageCached: sequelizeRedis.getModel(ChatMessage, { ttl: 60 * 60 }),
    ChatMessage,
    ChatRoomCached: sequelizeRedis.getModel(ChatRoom, { ttl: 60 * 60 }),
    ChatRoom,
    ChatUser,
    SiteVisit,
    SiteVisitor,
    Registration,
    Event,
    EventCached: sequelizeRedis.getModel(Event, { ttl: 60 * 60 }),
    PageModel,
    PageSection,
    PageSectionCached: sequelizeRedis.getModel(PageSection, { ttl: 60 * 60 }),
    AccountCached: sequelizeRedis.getModel(Account, { ttl: 60 * 60 }),
    Account,
    Communication,
    EmailListRecipient,
    RegistrationForm,
    ChatQuestion,
    Poll,
    PollOption,
    PollResponse,
    Permission,
    PlanType,
    Plan,
    InvoiceLineItem,
    Invoice,
    CustomLineItem,
  },
};
