const path = require('path');
require('dotenv').config({ path: path.resolve('.env') })
const discord = require('discord.js');
const config = require('./config');

const bot = new discord.Client();


function embedMessage({ color, title, fields }, channel) {
    const embedMessageVar = new discord.MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .addFields(
            ...fields
        )
        .setTimestamp();
    return channel.send(embedMessageVar);
}

bot.once('ready', () => {
    console.log('Online');
})

bot.on('message', message => {
    try {
        if (message.author.bot) return;

        if (message.content[0] !== config.prefix) return;

        const input = message.content.split(config.prefix)[1];
        const args = input.split(' ');
        const command = args[0].toLowerCase();

        if (command === 'serverinfo') {
            const data = {
                color: config.embedColor,
                title: "Server Info",
                fields: [
                    { name: 'Number of members:', value: `${message.guild.memberCount}` },
                    { name: 'Server region:', value: `${message.guild.region}` },
                ],
            }

            embedMessage(data, message.channel);
        }

        if (command === 'help') {

            const data = {
                color: config.embedColor,
                title: "Help",
                fields: [
                    // Gerencia os cargos do servidor (!cargos help para mais informações)
                    { name: '!serveInfo', value: 'Show the number of users in this server and the region' },
                    { name: '!role', value: 'Manage server roles (!role help for more information)' },
                ],
            }

            embedMessage(data, message.channel);
        }

        const cargos = {
            add() {
                let erros = [];
                for (let i = 2; i < args.length; i++) {
                    const role = message.guild.roles.cache.find(role => role.name.toLowerCase() === args[i].toLowerCase());
                    const member = message.member;

                    if (!role || config.cargosPrivilegiados.includes(args[i])) {
                        erros.push(args[i].toString());
                    }
                    else {
                        member.roles.add(role).catch(console.error);
                    }
                }
                if (erros.length) {
                    // Os cargos a seguir não existem ou você não possui permissão para usa-los:
                    message.reply(`The following roles doesn't exist or you don't have permission to have them: \n ${erros}`);
                }
                else { message.react('✔️').catch(console.error); }
            },

            delete() {
                let erros = [];
                for (let i = 2; i < args.length; i++) {
                    const role = message.guild.roles.cache.find(role => role.name.toLowerCase() === args[i].toLowerCase());
                    const member = message.member;

                    if (role) {
                        member.roles.remove(role).catch(console.error);
                    }
                    else {
                        erros.push(args[i].toString());
                    }
                }
                if (erros.length) {
                    message.reply(`The following roles doesn't exist or you don't have permission to use them: \n ${erros}`);
                } else {
                    message.react('✔️').catch(console.error);
                }
            },

            count() {
                let count = 0;
                const role = message.guild.roles.cache.find(role => role.name.toLowerCase() === args[2].toLowerCase());

                if (!role) {
                    message.reply(`Role: "${args[1]}" not found`);
                    return
                }
                const members = message.guild.members.cache;

                members.forEach(m => {
                    if (m.roles.cache.find(r => r === role)) count++;
                })

                message.reply(`Há ${count} ${(count > 1) ? 'members' : 'member'} with the role ${args[2]} `);
            },
            help() {
                const data = {
                    color: config.embedColor,
                    title: "Help !role",
                    fields: [
                        { name: '!role add *role name(s)*', value: 'Get one or more roles. Example: "!role add C++ Python"' },
                        { name: '!role delete *role name(s)*', value: 'Remove one or more roles. Exemple: "!role delete Java Typescript"' },
                        { name: '!role count *role name*', value: 'Count how many people have this role. Exemple "!cargos count C++"' },
                    ],
                }

                embedMessage(data, message.channel);
            }
        };

        if (command === 'role') {
            if (args.length <= 1)
                cargos.help()
            else
                cargos[args[1]]();
        }

    } catch (err) {
        console.error(err);
    }
});

bot.login(process.env.DISCORD_TOKEN);