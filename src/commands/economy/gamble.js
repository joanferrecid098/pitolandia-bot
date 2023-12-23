const { SlashCommandBuilder } = require("discord.js");
const UserProfile = require('../../schemas/UserProfile.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gamble')
    .setDescription('Gamble some of your $PTC.').addNumberOption((option) => 
      option
        .setName('amount')
        .setDescription('The amount you want to gamble.')
        .setRequired(true)
    ),
  run: async ({ interaction, client }) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: 'This command can only be executed inside a server.',
        ephemeral: true,
      });
      return;
    }

    const amount = interaction.options.getNumber('amount');

    if (amount < 100) {
      interaction.reply({
        content: 'You must gamble at least 100 $PTC.',
        ephemeral: true,
      });
      return;
    }

    let userProfile = await UserProfile.findOne({
      userId: interaction.user.id,
    });

    if (!userProfile) {
      userProfile = new UserProfile({
        userId,
      });
    }

    if (amount > userProfile.balance) {
      interaction.reply({
        content: "You don't have enough $PTC to gamble.",
        ephemeral: true,
      });
      return;
    }

    const didWin = Math.random() > 0.5;

    if (!didWin) {
      userProfile.balance -= amount;
      await userProfile.save();
      
      interaction.reply(`❌ You didn't win anything this time. Try again later.\n**Lost: ${amount} $PTC**`);
      return;
    }
    
    userProfile.balance += amount;
    await userProfile.save();

    interaction.reply(`🎉 YOU WON!!!. \n**Amount won: ${amount} $PTC**`);
  },
}