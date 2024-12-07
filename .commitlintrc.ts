import type { UserConfig } from '@commitlint/types';
import { RuleConfigSeverity } from '@commitlint/types';
import { globSync } from 'glob';
import { basename } from 'node:path';

export default <UserConfig>{
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      RuleConfigSeverity.Error,
      'always',
      globSync('packages/public/*/').map(pkg => basename(pkg))
    ],
    'type-enum': [
      RuleConfigSeverity.Error,
      'always',
      ['feat', 'chore', 'release', 'fix', 'test', 'refactor']
    ],
    release: [RuleConfigSeverity.Error, 'always']
  },
  plugins: [
    {
      rules: {
        release({ type, subject }) {
          if (type !== 'release') return [true];
          if (
            !subject ||
            !/^v?\d+\.\d+\.\d+(-(rc|beta|alpha)(\.\d+)?)?$/.test(subject)
          )
            return [
              false,
              `release type must follow format 'release: vX.Y.Z[-rc|beta|alpha][.X]'`
            ];
          return [true];
        }
      }
    }
  ]
};
