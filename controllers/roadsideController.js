// controllers/roadsideController.js
// Handles roadside assistance page

const showRoadside = (req, res) => {
  // Emergency contacts list - can be expanded
  const emergencyContacts = [
    { name: 'National Highway Helpline', number: '1033', icon: '🛣️', description: 'For highway emergencies and accidents' },
    { name: 'Police Emergency', number: '100', icon: '🚔', description: 'For accidents, theft, or safety threats' },
    { name: 'Ambulance', number: '108', icon: '🚑', description: 'For medical emergencies' },
    { name: 'Fire Brigade', number: '101', icon: '🚒', description: 'For fire-related emergencies' },
    { name: 'Road Accident Emergency', number: '1073', icon: '⚠️', description: 'Road accident emergency helpline' },
    { name: 'Tow Truck / NHAI', number: '1800-180-3333', icon: '🚛', description: 'Towing and breakdown services' },
  ];

  res.render('roadside', {
    title: 'Roadside Assistance - Auto Aid',
    userName: req.session.userName,
    emergencyContacts,
    success: req.flash('success'),
    error: req.flash('error')
  });
};

// Handle help request (basic backend logging)
const requestHelp = (req, res) => {
  const { helpType, location, description } = req.body;
  // In a real app, this would send an SMS/email or call an API
  console.log(`🆘 Help requested by user ${req.session.userId}: ${helpType} at ${location}`);
  req.flash('success', `Help request sent! Emergency services have been notified. Stay calm and stay safe.`);
  res.redirect('/roadside');
};

module.exports = { showRoadside, requestHelp };
