# 💧 Water Reminder App

A beautiful and intuitive React Native app to help you stay hydrated throughout the day. Track your water intake with a creative water bottle visualization that fills up as you drink more water.

## Features

- 🎨 **Creative Water Bottle Design**: Visual water bottle that shows your hydration progress with animated water level
- 📊 **Water Intake Tracking**: Track your daily water consumption with multiple preset amounts (100ml, 200ml, 250ml, 500ml)
- 🔔 **Smart Reminders**: Customizable push notifications with multiple interval options (30 min, 1 hour, 2 hours, 3 hours)
- ⏰ **Flexible Time Range**: Set custom start and end times for your reminders
- 📈 **Progress Statistics**: View your daily consumption, goal progress, and remaining water needed
- 💾 **Data Persistence**: Your water intake data is automatically saved and persists across app restarts
- 🔄 **Daily Reset**: Automatically resets your daily intake at midnight

## Installation

1. **Install dependencies:**
   ```bash
   cd waterbuddy
   npm install
   ```

2. **Start the Expo development server:**
   ```bash
   npm start
   ```

3. **Run on your device:**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator / `a` for Android emulator

## Usage

1. **Track Water Intake:**
   - Tap any of the water intake buttons (100ml, 200ml, 250ml, 500ml)
   - Watch the water bottle fill up as you add more water
   - View your progress in the stats card below the bottle

2. **Set Up Reminders:**
   - Tap the settings icon (⚙️) in the top right
   - Enable reminders toggle
   - Choose your preferred interval (30 min, 1 hour, 2 hours, or 3 hours)
   - Set your start and end times
   - Customize the reminder amount
   - Save your settings

3. **View Progress:**
   - Check the percentage displayed on the water bottle
   - View consumed, goal, and remaining amounts in the stats card
   - Monitor the progress bar

## Project Structure

```
waterbuddy/
├── App.js                 # Main app component
├── src/
│   ├── screens/
│   │   ├── MainScreen.js           # Main screen with water bottle
│   │   └── ReminderSettingsScreen.js # Reminder settings screen
│   ├── components/
│   │   ├── WaterBottle.js          # Water bottle visualization
│   │   ├── WaterIntakeButtons.js   # Water intake buttons
│   │   └── StatsCard.js            # Statistics display card
│   └── utils/
│       ├── storage.js              # AsyncStorage utilities
│       └── notifications.js        # Push notification setup
├── package.json
└── app.json
```

## Technologies Used

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **React Native Paper** - UI component library
- **React Native SVG** - SVG rendering for water bottle
- **Expo Notifications** - Push notifications
- **AsyncStorage** - Local data persistence

## Permissions

The app requires notification permissions to send water reminder alerts. You'll be prompted to grant these permissions when you first enable reminders.

## Customization

- **Default Goal**: Set to 2000ml (2 liters) - can be customized in the code
- **Water Amounts**: Modify the preset amounts in `WaterIntakeButtons.js`
- **Colors**: Customize the color scheme in the StyleSheet objects throughout the app

## Notes

- The app automatically resets daily intake at midnight
- Notifications are scheduled daily and repeat based on your interval settings
- All data is stored locally on your device

## License

This project is open source and available for personal use.

