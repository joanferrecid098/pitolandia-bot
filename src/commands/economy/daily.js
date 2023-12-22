const { SlashCommandBuilder } = require("discord.js");
const UserProfile = require('../../schemas/UserProfile.js');

const dailyAmount = 500;

module.exports = {
  data: new SlashCommandBuilder().setName('daily').setDescription(`Collect your daily ${dailyAmount.toString()} $PTC.`),
  run: async ({ interaction }) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: 'This command can only be executed inside a server.',
        ephemeral: true,
      });
      return;
    }

    try {
      await interaction.deferReply({
        ephemeral: true,
      });

      let userProfile = await UserProfile.findOne({
        userId: interaction.member.id,
      });

      if (userProfile) {
        const lastDailyDate = userProfile.lastDailyCollected?.toDateString();
        const currentDate = new Date().toDateString();

        if (lastDailyDate === currentDate) {
          interaction.editReply(
            'You have already collected your daily $PTC today. Come back tomorrow.'
          );
          return;
        }
      } else {
        userProfile = new UserProfile({
          userId: interaction.member.id,
        });
      }

      userProfile.balance += dailyAmount;
      userProfile.lastDailyCollected = new Date();

      await userProfile.save();

      interaction.editReply(
        `${dailyAmount} $PTC was added to your balance.\n**New balance: ${userProfile.balance} $PTC**`
      );
    } catch (error) {
      console.log(`Error handling /daily: ${error}`);
    }
  },
}