const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data.json');

const defaults = {
  adminRoleId: null,
  supportRoles: [],
  logsChannelId: null,
  receiveChannelId: null,
  panelChannelId: null,
  categoryId: null,
  panelImage: null,
  panelTitle: '🎫 فواتح تذكرة',
  panelDescription:
    'أهلاً بك 👋\nاختر القسم المناسب من القائمة بالأسفل وسيتم فتح تذكرة خاصة بك وسيقوم فريق الدعم بمساعدتك.',
  ticketOptions: [],
  pendingRequests: {},
  pendingNewOptions: {},
  topRoles: [],
  topChannels: [],
  topPoints: {},
};

function applyEnvOverrides(base) {
  const d = { ...base };
  const csv = (v) => String(v || '').split(',').map((s) => s.trim()).filter(Boolean);

  if (process.env.PANEL_CHANNEL_ID) d.panelChannelId = process.env.PANEL_CHANNEL_ID.trim();
  if (process.env.RECEIVE_CHANNEL_ID) d.receiveChannelId = process.env.RECEIVE_CHANNEL_ID.trim();
  if (process.env.LOGS_CHANNEL_ID) d.logsChannelId = process.env.LOGS_CHANNEL_ID.trim();
  if (process.env.CATEGORY_ID) d.categoryId = process.env.CATEGORY_ID.trim();
  if (process.env.PANEL_IMAGE) d.panelImage = process.env.PANEL_IMAGE.trim();
  if (process.env.PANEL_TITLE) d.panelTitle = process.env.PANEL_TITLE.trim();
  if (process.env.PANEL_DESCRIPTION) d.panelDescription = process.env.PANEL_DESCRIPTION.trim();
  if (process.env.ADMIN_ROLE_ID) d.adminRoleId = process.env.ADMIN_ROLE_ID.trim();
  if (process.env.SUPPORT_ROLES) d.supportRoles = csv(process.env.SUPPORT_ROLES);
  if (process.env.TOP_ROLES) d.topRoles = csv(process.env.TOP_ROLES);
  if (process.env.TOP_CHANNELS) d.topChannels = csv(process.env.TOP_CHANNELS);
  return d;
}

function load() {
  try {
    if (fs.existsSync(FILE)) {
      const text = fs.readFileSync(FILE, 'utf8').replace(/^\uFEFF/, '');
      const raw = JSON.parse(text);
      return applyEnvOverrides({ ...defaults, ...raw });
    }
  } catch (err) {
    console.error('خطأ في قراءة data.json:', err.message);
  }
  return applyEnvOverrides({ ...defaults });
}

const data = load();

function save() {
  try {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('خطأ في حفظ data.json:', err.message);
  }
}

module.exports = { data, save };