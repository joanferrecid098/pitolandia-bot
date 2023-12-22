const { SlashCommandBuilder } = require("discord.js");
const Cooldown = require('../../schemas/Cooldown.js');
const UserProfile = require('../../schemas/UserProfile.js');

function getRadomNumber(x, y) {
  const range = y - x + 1;
  const randomNumber = Math.floor(Math.random() * range);
  return randomNumber + x;
}

module.exports = {
  data: new SlashCommandBuilder().setName('beg').setDescription('Beg to get some extra cash.'),
  run: async ({ interaction }) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: 'This command can only be executed inside a server.',
        ephemeral: true,
      });
      return;
    }
    
    try {
      await interaction.deferReply();

      const commandName = 'beg';
      const userId = interaction.user.id;
      
      let cooldown = await Cooldown.findOne({ userId, commandName });

      if (cooldown && Date.now() < cooldown.endsAt) {
        const { default: prettyMs } = await import('pretty-ms');

        await interaction.editReply(
          `You are on cooldown, come back after *${prettyMs(cooldown.endsAt - Date.now())}*`
        );
        return;
      }

      if (!cooldown) {
        cooldown = new Cooldown({ userId, commandName });
      }

      const chance = getRadomNumber(0, 100);

      if (chance < 40) {
        await interaction.editReply("You didn't get anything this time. Try again later.");

        cooldown.endsAt = Date.now() + 300_000;
        await cooldown.save();
        return;
      }

      const amount = getRadomNumber(30, 150);

      let userProfile = await UserProfile.findOne({ userId }).select('userId balance');

      if (!userProfile) {
        userProfile = new UserProfile({ userId });
      }

      userProfile.balance += amount;
      cooldown.endsAt = Date.now() + 300_000;

      await Promise.all([cooldown.save(), userProfile.save()]);

      await interaction.editReply(
        `You got ${amount} $PTC!\n**New balance: ${userProfile.balance} $PTC**`
      );
    } catch (error) {
      console.log(`Error handling /beg: ${error}`);
    }
  },
}