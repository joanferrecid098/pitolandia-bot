const { SlashCommandBuilder } = require("discord.js");
const UserProfile = require('../../schemas/UserProfile.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roulette')
    .setDescription('Play roulette to gamble some of your $PTC.').addNumberOption((option) => 
      option
        .setName('amount')
        .setDescription('The amount you want to gamble.')
        .setRequired(true)
    ),
  run: async ({ interaction, client }) => {
    await interaction.deferReply();

    const blackResult = ":black_large_square::black_large_square::arrow_down::black_large_square::black_large_square:\n\n:black_large_square::red_square::black_large_square::red_square::black_large_square:\n:red_square::blue_square::green_square::blue_square::red_square:\n:black_large_square::green_square::white_large_square::green_square::black_large_square:\n:red_square::blue_square::green_square::blue_square::red_square:\n:black_large_square::red_square::black_large_square::red_square::black_large_square:";
    const redResult = ":red_square::red_square::arrow_down::red_square::red_square:\n\n:red_square::black_large_square::red_square::black_large_square::red_square:\n:black_large_square::blue_square::green_square::blue_square::black_large_square:\n:red_square::green_square::white_large_square::green_square::red_square:\n:black_large_square::blue_square::green_square::blue_square::black_large_square:\n:red_square::black_large_square::red_square::black_large_square::red_square:";

    let current = 0;
    
    function showColor(times) {
      for (let i = 0; i < times; i++) {
        if (current === 0) {
          interaction.editReply(blackResult);
          current = 1;
        } else {
          interaction.editReply(redResult);
          current = 0;
        }
      }
    }

    showColor(30)
  },
  
}