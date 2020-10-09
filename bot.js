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
        if (message.author.bot) return;

        const input = message.content.split(config.prefix)[1];
        const args = input.split(' ');
        const command = args[0].toLowerCase();

        if (command === 'serverinfo') {
            message.reply(`Número de membros: ${message.guild.memberCount}\n Região do servidor: ${message.guild.region}`);
        }

        if (command === 'help') {
            message.reply(`Segue uma lista de todas as coisas legais que eu sei fazer: \n
                            !serveInfo: Mostra o número de pessoas no server, e a região em que ele se encontra. \n
                            !cargos: Gerencia os cargos do servidor (!cargos help para mais informações)`)
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
                    message.reply(`Os cargos a seguir não existem ou você não possui permissão para usa-los: \n ${erros}`);
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
                    message.reply(`Os cargos a seguir não existem ou você não possui permissão para deleta-los: \n ${erros}`);
                } else {
                    message.react('✔️').catch(console.error);
                }
            },

            count() {
                let count = 0;
                const role = message.guild.roles.cache.find(role => role.name.toLowerCase() === args[2].toLowerCase());

                if (!role) {
                    message.reply(`O cargo "${args[1]}" não foi encontrado.`);
                    return
                }
                const members = message.guild.members.cache;

                members.forEach(m => {
                    if (m.roles.cache.find(r => r === role)) count++;
                })

                message.reply(`Há ${count} ${(count > 1) ? 'membros' : 'membro'} com o cargo ${args[2]} `);
            },
            help() {
                message.reply(`!cargos add *nome do(s) cargo(s)* para atribuir um ou mais cargos. Exemplo: "!cargos add C++ Python\n
                                !cargos delete *nome do(s) cargo(s)* para remover um ou mais cargos. Exemplo: "!cargos delete Java Typescript\n
                                !cargos count *nome do cargo* para contar quantas pessoas possuem este cargo. Exemplo "!cargos count C++`);
            }
        };

        if (command === 'cargos') {
            cargos[args[1]]();
        }

    } catch (err) {
        console.error(err);
    }
});

bot.login(process.env.DISCORD_TOKEN);