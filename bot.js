const path = require('path');
require('dotenv').config({ path: path.resolve('.env') })
const discord = require('discord.js');
const config = require('./config');

const bot = new discord.Client();


bot.once('ready', () => {
    console.log('Online');
})

bot.on('message', message => {
    try {
        if (message.author.bot) { return; }

        const input = message.content.split(config.prefix)[1];
        console.log(input);
        const args = input.split(' ');
        const command = args[0].toLowerCase();

        console.log(args, command);

        if (command === 'serverinfo') {
            message.reply(`Número de membros: ${message.guild.memberCount}\n Região do servidor: ${message.guild.region}`);
        }

        if (command === 'cargos') {
            if (args[1] === 'add') {
                let erros = [];
                for (let i = 2; i < args.length; i++) {
                    const role = message.guild.roles.cache.find(role => role.name === args[i]);
                    const member = message.member;

                    if (!role || config.cargosPrivilegiados.includes(args[i])) {
                        erros.push(args[i].toString());
                    }
                    else {
                        member.roles.add(role).catch(console.error);
                    }
                }
                if (erros.length) {
                    message.reply(`Os cargos a seguir não existem ou você não possui permissão para usa-los: \n ${erros}`);
                }
                else { message.react('✔️').catch(console.error); }
            }

            else if (args[1] === 'delete') {
                let erros = [];
                for (let i = 2; i < args.length; i++) {
                    const role = message.guild.roles.cache.find(role => role.name === args[i]);
                    const member = message.member;

                    if (role) {
                        member.roles.remove(role).catch(console.error);
                    }
                    else {
                        erros.push(args[i].toString());
                    }
                }
                if (erros.length) {
                    message.reply(`Os cargos a seguir não existem ou você não possui permissão para deleta-los: \n ${erros}`);
                }
                else { message.react('✔️').catch(console.error); }
            }

            else if (args[1] === 'count') {
                let count = 0;
                const role = message.guild.roles.cache.find(role => role.name === args[2]);

                if (!role) {
                    message.reply(`O cargo "${args[1]}" não foi encontrado.`);
                    return
                }
                const members = message.guild.members.cache;

                members.forEach(m => {
                    if (m.roles.cache.find(r => r === role)) count++;
                })

                console.log("Respondeu");
                message.reply(`Há ${count} ${(count > 1) ? 'membros' : 'membro'} com o cargo ${args[2]} `);

            }
        }
    } catch (err) {
        console.error(err);
    }
});

bot.login(process.env.DISCORD_TOKEN);