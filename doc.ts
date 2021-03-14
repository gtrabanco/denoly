#!/usr/bin/env -S deno run --allow-net --allow-read
/*
##? This is a description
##?
##? Usage:
##?  __COMMAND__ [--toggle]
##?
##? Options:
##?   --toggle  Toggle option
##?
*/
import {docopt} from "./deps.ts";

const __filename = new URL('', import.meta.url).pathname;
const __dirname  = new URL('.', import.meta.url).pathname;
const __command  = import.meta.url;

export class Doc {
    static async doc(command:string = ''): Promise<object|void> {
        const regexp_docbloc=/^##\?\s?(.*)$/;
        const data = await Deno.readTextFile(__filename);
        let docbloc:string[] = [];
        let content:any
        data.split("\n").forEach((line)=> {
            content = '';
            content = line.match(regexp_docbloc);
            if(content !== null && content.length > 1) {
                content = content[1].replace('__COMMAND__',command === '' ? __command: command);
                docbloc.push(content);
            }
        });

        try {
            console.log(docopt(docbloc.join("\n"), ));
        } catch (e) {
            console.warn(e.message);
            return;
        }
    }
}

//console.log(await Doc.doc('dot doc'));

const doc = `
Example of program which uses [options] shortcut in pattern.

Usage:
  ${import.meta.url} [options] <port>
Options:
  -h --help                show this help message and exit
  --version                show version and exit
  -n, --number N           use N as a number
  -t, --timeout TIMEOUT    set timeout TIMEOUT seconds
  --apply                  apply changes to database
  -q                       operate in quiet mode
`;
try {
    console.log(JSON.stringify(docopt(doc, {version: '1.0.0rc2'}), null, '\t'));
} catch (e) {
    console.error(e.message);
}