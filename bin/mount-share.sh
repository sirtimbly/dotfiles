#!/bin/zsh

# Network share details

mount_point="/Volumes/music"  # Adjust if needed

# Function to check if the share is already mounted
is_mounted() {
	mount | grep -q "$1"
}

# Function to mount the share
mount_share() {
	if ! is_mounted "$mount_point"; then
		osascript <<-EOF
			tell application "Finder"
				try
					mount volume "$AUTO_MOUNT1"
				on error
					display notification "Failed to connect to network share." with title "Connection Error"
				end try
			end tell
		EOF
	fi
}


mount_share
