# react-native-upper

Simple

## Installation

```sh
yarn add react-native-upper
```

## Installation dependencies

```sh
yarn add reflect-metadata react-native-quick-sqlite
```

## Usage

```js
import 'reflect-metadata';
import 'react-native-quick-sqlite';
import { Upper } from 'react-native-upper';
import { User } from './src/entities/user.entity';

// ...

const upper = new Upper({
    name: 'upper.sllite' // database name,
    entities: {
        User
    }
});

const users = upper.Query('User');

import { Observer } from 'react-native-upper/src/react/Observer'

const Home = () => {

    function handleUpdate(){
        users.at(0).name = "Upper name" //detect change
    }

    return (
        <View style={styles.container} >
            <Observer>
                {() => users.map(user => (
                    <Observer key={user.id}> //update some item list
                       {() => <Text>{user.name}</Text>}
                    </Observer>
                ))}
            </Observer>

            <Button title="Update name" onPress={handleUpdate} />
        </View>
    )
}

import {
  Field,
  PrimaryColumn,
  UpperEntity,
} from 'react-native-upper/src/decorators';

@UpperEntity('users')
export class User {
  @PrimaryColumn({type: 'uuid'})
  id: string;

  @Field({type: 'string'})
  name: string;
}


```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
