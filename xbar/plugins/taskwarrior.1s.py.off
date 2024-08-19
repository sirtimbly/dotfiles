#!/usr/bin/env -S PATH="${PATH}:/opt/homebrew/bin:/usr/local/bin" python3
# -*- coding: utf-8 -*-
#
# Taskwarrior
#
# <xbar.title>Taskwarrior</xbar.title>
# <xbar.version>v2.0</xbar.version>
# <xbar.author>Christoph Russ</xbar.author>
# <xbar.author.github>christophruss</xbar.author.github>
# <xbar.desc>Task managment through your menu-bar.</xbar.desc>
# <xbar.dependencies>task,python</xbar.dependencies>
# <xbar.image>http://i.imgur.com/vjEt7Is.jpg</xbar.image>
#
# Dependencies:
#   taskwarrior (http://taskwarrior.org)
#      available via homebrew `brew install task`

#
# TODO
# - [ ] In a sub-menu (at the bottom) Allow to restart previously completed tasks
# - [ ] Allow to delete tasks (also in a sub-menu?)
# - [ ] setting for font size


import os
import re
import subprocess
from subprocess import Popen, PIPE


def trigger_actions(argv):
    t_id = argv[-1]
    action = argv[-2]
    path_task = subprocess.check_output(['which', 'task']).decode('ascii').rstrip()
    subprocess.call([path_task, t_id, action])


def build_command(t_id, action, refresh=True):
    cmd = ''

    if refresh:
        cmd = cmd + ' refresh=true'
        cmd = cmd + ' shell=/usr/local/bin/task'
        cmd = cmd + ' param1=' + str(t_id)
        cmd = cmd + ' param2=' + action
        cmd = cmd + ' terminal=false' #change to true for debugging

    # cmd = cmd + ' shell=/bin/sh param1=/usr/local/bin/task'
    # cmd = cmd + ' param2=' + str(t_id)
    # cmd = cmd + ' param3=' + action


    return cmd


def print_output(
        cmd,
        color,
        head,
        print_content=True,
        command='',
        ignore_id_list=[],
        highlight_id_list=[],
        highlight_color=' color=Red',
        highlight_command='',
        alternate_command='',
        prepend_char='⎕ '):
    output = ''

    path_task = subprocess.check_output(['which', 'task']).decode('ascii').rstrip()

    # important: PIPE the stderr, since task likes to use that - a lot ...
    p = Popen([path_task, cmd],
              stdin=None, stdout=PIPE, stderr=PIPE)
    output, err = p.communicate()

    output_lines = output.decode('utf-8').split('\n')

    # next total
    p1 = Popen([path_task, 'count', '+PENDING'],
              stdin=None, stdout=PIPE, stderr=PIPE)
    output1, err1 = p1.communicate()

    pending_count = output1.decode('utf-8')


    id_list = []
    content_lines = []

    for output_line in output_lines:
        output_line = output_line.rstrip()
        if not output_line:
            continue
        # When looking for 'active' or 'next' tasks, we want to look only at
        # lines that start with a digit or a -. Other line are likely extra
        # data like annotations from bugwarrior sync
        content_id = output_line.split()[0]
        if not content_id.isdigit() and content_id not in ['--', '-', 'ID']:
            continue
        line_groups = re.match('^(\s*\d+|\s*ID|\s*-+)(.*)', output_line)
        content_lines.append('[{}]{}'.format(*line_groups.groups()))

    content_count = len(content_lines[2:-1])

    if head:
        if content_count == 0:
            print("ⓣ" + '/' + str(pending_count))    # ⓪ #⓿
        elif content_count < 21:
            circle_number = ["⓪", "①", "②", "③", "④", "⑤", "⑥",
                             "⑦", "⑧", "⑨", "⑩", "⑪", "⑫", "⑬",
                             "⑭", "⑮", "⑯", "⑰", "⑱", "⑲", "⑳"]
            print('⚡️' + circle_number[content_count] + '/' + str(pending_count) + ' | '  + '')
        else:
            print(str(content_count))   + '| color=Red'

        print('---')

    if content_count < 1:
        return id_list

    table_head = content_lines[0]

    # total_number_of_tasks = content_lines[-1]

    content_formatting = ' | color=black size=13 font="Source Code Pro" '

    if print_content:
        print('╔═ ' + cmd + content_formatting)
        print('║ ' + table_head + content_formatting)
        print('---')

    for content_line in content_lines[2:-1]:
        content_re = re.match('^\[\s*(.+)\]\s+([0-9A-Fa-f]+)?', content_line)
        if not content_re:
            continue

        content_id = content_re.group(1)

        if content_id == '-':
            # should be the UUID in this case
            content_id = content_re.group(2)

        if content_id in ignore_id_list:
            continue

        id_list.append(content_id)

        if print_content:
            cmd = ''

            if len(command) > 0:
                cmd = build_command(t_id=content_id, action=command)

            if content_id in highlight_id_list:
                if len(highlight_command) > 0:
                    cmd = build_command(
                        t_id=content_id, action=highlight_command)
                print('⍄ ' + content_line + content_formatting + highlight_color + cmd)
            else:
                print(prepend_char + content_line + content_formatting + color + cmd)

            # adding an alternative command (press ALT for this!)
            # printing the same stuff again, only with a different action
            # attached
            if len(alternate_command) > 0:
                alt_cmd = build_command(
                    t_id=content_id, action=alternate_command)

                if content_id in highlight_id_list:
                    print('⍄ ' + content_line + content_formatting + highlight_color + alt_cmd + ' alternate=true')
                else:
                    print(prepend_char + content_line + content_formatting + color + alt_cmd + ' alternate=true')

    return id_list


def is_darkmode():
    FNULL = open(os.devnull, 'w')
    return_code = subprocess.call(['/usr/bin/defaults', 'read', '-g',
                                   'AppleInterfaceStyle'], stdout=FNULL, stderr=subprocess.STDOUT)
    if (return_code == 1):
        return False
    else:
        return True


def main(argv):

    if len(argv) > 1:
        trigger_actions(argv)
        exit()

    if is_darkmode():
        color_running = ' color=#b9d977'
        color_pending = ' color=#c4e2f2'
        color_completed = ' color=#dedede'
    else:
        color_running = ' color=Green'
        color_pending = ' color=Black'
        color_completed = ' color=White'

    id_list = print_output('active', color_running, True, print_content=False)

    if len(id_list) > 0:
        print('---')

    print_output(
        'nextxbar',
        color_pending,
        False,
        command='start',
        highlight_id_list=id_list,
        highlight_color=color_running,
        highlight_command='stop',
        alternate_command='done')

    print('---')

    # ok, so if you want to delete a command, you have to press done first ...
    # sorry, but there is only one alternative command I can provide above ...
    print_output(
        'completed',
        color_completed,
        False,
        command='"modify status:pending"',
        alternate_command='delete',
        prepend_char="〿 ")

    return

if __name__ == "__main__":
    import sys
    main(sys.argv)
