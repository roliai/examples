import { deleteObject,saveData,getData,fireEvent,
    createUuid, Data, Event, Endpoint } from "./roli-runtime";

export class Exercise extends Data {
    constructor(public user: User, public description: string, public duration: number, public date: Date) {
        const id = createUuid(false);
        console.log(`Exercise id= ${id}`);
        super(id);
    }
}

export class ExerciseAdded extends Event {
    constructor(public exercise: Exercise) {
        super();
    }
}

export class User extends Data {
    constructor(public username: string) {
        super(username);
    }
}

/**
 * An endpoint whose job is to keep track of all the users and exercises and provide access to both.
 */
export class ExerciseTrackerEndpoint extends Endpoint {
    // @ts-ignore
    private _userIndex: Set<string>;
    // @ts-ignore
    private _exerciseIndex: Set<string>;

    constructor(primaryKey: string) {
        super(primaryKey);
        // @ts-ignore
        this._userIndex = new Set();
        // @ts-ignore
        this._exerciseIndex = new Set();
    }

    deleteUser(user: User) {
        if (!user || !(user instanceof User)) {
            throw new Error('User was invalid');
        }
        this._userIndex.delete(user.primaryKey);
        deleteObject(user);
    }

    addUser(username: string): User {
        if (this._userIndex.has(username)) {
            throw new Error("A user with that name already exists");
        }
        const user = new User(username);
        saveData(user);
        this._userIndex.add(user.primaryKey);
        return user;
    }

    userExists(username: string): boolean {
        return this._userIndex.has(username);
    }

    tryGetUser(username: string): User | null {
        if (this._userIndex.has(username))
            return getData(User, username);
        return null;
    }

    getUsers(): User[] {
        let users: User[] = [];
        for (const pk of this._userIndex)
            users.push(getData(User, pk));
        return users;
    }

    addExercise(exercise: Exercise) {
        if (!exercise || !(exercise instanceof Exercise)) {
            throw new Error('Exercise was invalid');
        }
        if (this._exerciseIndex.has(exercise.primaryKey)) {
            throw new Error(`Exercise ${exercise.primaryKey} already exists`);
        }
        saveData(exercise);
        this._exerciseIndex.add(exercise.primaryKey);
        fireEvent(this, new ExerciseAdded(exercise));
    }

    deleteExercise(primaryKey: string) {
        const exercise = getData(Exercise, primaryKey);
        if (exercise) {
            this._exerciseIndex.delete(exercise.primaryKey);
            deleteObject(exercise);
        } else {
            throw new Error('Failed to delete exercise because it does not exist');
        }
    }

    getMaxDuration(): number | null {
        let max: number | null = null;
        for (const pk of this._exerciseIndex) {
            const exercise = getData(Exercise, pk);
            if (!max || exercise.duration > max)
                max = exercise.duration;
        }
        return max;
    }

    getExercises(): Exercise[] {
        let exercises: Exercise[] = [];
        for (const pk of this._exerciseIndex) {
            exercises.push(getData(Exercise, pk));
        }
        return exercises;
    }
}