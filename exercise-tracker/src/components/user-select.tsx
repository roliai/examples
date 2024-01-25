import {User} from "exercise-tracker-service";
import Select from "react-select";
import React from "react";

export interface SelectedUser {
    selected: User | null;
}

export interface UserSelectProps {
    users: User[] | undefined,
    selectedUser: SelectedUser | undefined,
    setSelectedUser: React.Dispatch<React.SetStateAction<SelectedUser | undefined>>
}

export function UserSelect(props: UserSelectProps) {
    return (
        <Select
            required
            isMulti={false}
            value={props.selectedUser?.selected}
            onChange={(user_: User | null) => {
                props.setSelectedUser({selected: user_});
            }}
            getOptionLabel={(user: User) => user.username}
            getOptionValue={(user: User) => user.username}
            options={props.users}
        />
    );
}