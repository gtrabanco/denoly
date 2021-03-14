#!/usr/bin/env -S deno run --allow-net --allow-read
/*
##? This is a description
##?
##? Usage:
##?   __COMMAND__ [--help] [--toggle]
##?   __COMMAND__ other [--toggle]
##?
##? Options:
##?   --help -h  Prints this help
##?   --toggle   Toggle option
##?
*/
import {docopt} from "./deps.ts";

const __filename = new URL('', import.meta.url).pathname;
const __dirname  = new URL('.', import.meta.url).pathname;
const __command  = import.meta.url;

export class Doc {
    static doc(command:string = ''): object {
        const regexp_docbloc=/^##\?\s?(.*)$/;
        const data = Deno.readTextFileSync(__filename);
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
            //return JSON.parse(JSON.stringify(docopt(docbloc.join("\n")), null, "\t"));
            return docopt(docbloc.join("\n"));
        } catch (e) {
            console.warn(e.message);
            return {};
        }
    }
}

/*
function myfunc(toggle) {
    console.log('Toggle is toggle')
}

function other() {
    console.log('other activated')
}

await Doc.doc('dot doc', {
    "--toggle": myfunc(true)
});*/

const v = Doc.doc();
console.log(v);