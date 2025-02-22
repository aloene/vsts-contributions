import { IIdentity } from "./controls/IdentityPicker";
import { CachedValue } from "./data/CachedValue";
import { defaultRepostory } from "./data/git/repositories";

export interface IEnabledProviders {
  Commit: boolean;
  CreatePullRequest: boolean;
  ClosePullRequest: boolean;
  ReviewPullRequest: boolean;
  CreateWorkItem: boolean;
  CloseWorkItem: boolean;
  ResolveWorkItem: boolean;
  Changeset: boolean;
}

export interface ISelectedRange {
  startDate: Date;
  endDate: Date;
}

export interface IContributionFilter {
  identities: IIdentity[];
  allProjects: boolean;
  sharedScale: boolean;
  enabledProviders: IEnabledProviders;
  repositories: { key: string; name: string }[];
}

export interface IIndividualContributionFilter {
  identity: IIdentity;
  allProjects: boolean;
  sharedScale: boolean;
  enabledProviders: IEnabledProviders;
  repositories: { key: string; name: string }[];
}

export function deepEqual(x, y): boolean {
  return (x && y && typeof x === 'object' && typeof y === 'object') ?
    (Object.keys(x).length === Object.keys(y).length) &&
    Object.keys(x).reduce(function (isEqual, key) {
      return isEqual && deepEqual(x[key], y[key]);
    }, true) : (x === y);
}

export const defaultFilter: CachedValue<IContributionFilter> = new CachedValue(getDefaultFilter);
async function getDefaultFilter(): Promise<IContributionFilter> {
  const defaultRepo = await defaultRepostory.getValue();
  const repositories: { key: string, name: string }[] = [];
  if (defaultRepo) {
    repositories.push({ key: defaultRepo.id, name: defaultRepo.name });
  }
  const filter: IContributionFilter = {
    identities: [{
      displayName: VSS.getWebContext().user.name,
      id: VSS.getWebContext().user.id,
      uniqueName: VSS.getWebContext().user.email,
      imageUrl: `${VSS.getWebContext().collection
        .uri}_api/_common/identityImage?size=2&id=${VSS.getWebContext().user.id}`
    }],
    allProjects: false,
    sharedScale: false,
    enabledProviders: {
      Commit: true,
      CreatePullRequest: true,
      ClosePullRequest: true,
      ReviewPullRequest: true,
      CloseWorkItem: true,
      CreateWorkItem: true,
      ResolveWorkItem: true,
      Changeset: false,
    },
    repositories,
  };
  return filter;
}

