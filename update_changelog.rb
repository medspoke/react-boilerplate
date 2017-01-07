#!/usr/bin/env ruby

from = ARGV[0]
to = ARGV[1]
type = ARGV[2]

# Changelog update

commit_log = `git log #{from}..HEAD --format=format:'%s%n %b' --no-merges`.strip

commits = commit_log.split("\n").map do |line|
  "#{line}"
end

changelog_file = './CHANGELOG.md'

header = type == 'patch' ? '### Patch' : '## Release'
require 'date'
date = DateTime.now.strftime '%Y-%m-%d'
rest = File.read changelog_file

msg = <<-MSG
#{header} #{to} - #{date}

#{commits.join "\n"}

#{rest}
MSG

File.open(changelog_file, 'w') do |f|
  f.puts msg
end
