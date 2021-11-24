// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, ActionCreatorsMapObject} from 'redux';

import {ActionFunc, ActionResult, GenericAction} from 'mattermost-redux/types/actions';

import {GlobalState} from 'types/store';

import {getCurrentUserId, getProfilesInGroup, searchProfilesInGroup} from 'mattermost-redux/selectors/entities/users';
import {getGroup as getGroupById} from 'mattermost-redux/selectors/entities/groups';
import {getGroup, removeUsersFromGroup, searchGroups} from 'mattermost-redux/actions/groups';
import {Group, GroupSearachParams} from 'mattermost-redux/types/groups';
import {ModalData} from 'types/actions';
import {ModalIdentifiers} from 'utils/constants';
import {isModalOpen} from 'selectors/views/modals';
import {closeModal, openModal} from 'actions/views/modals';
import {setModalSearchTerm} from 'actions/views/search';
import {UserProfile} from 'mattermost-redux/types/users';
import {getProfilesInGroup as getUsersInGroup, searchProfiles} from 'mattermost-redux/actions/users';

import ViewUserGroupModal from './view_user_group_modal';

type Actions = {
    getGroup: (groupId: string, includeMemberCount: boolean) => Promise<{data: Group}>;
    getUsersInGroup: (groupId: string, page: number, perPage: number) => Promise<{data: UserProfile[]}>;
    setModalSearchTerm: (term: string) => void;
    openModal: <P>(modalData: ModalData<P>) => void;
    searchProfiles: (term: string, options: any) => Promise<ActionResult>;
    removeUsersFromGroup: (groupId: string, userIds: string[]) => Promise<ActionResult>;
};

type ownProps = {
    groupId: string;
};

function mapStateToProps(state: GlobalState, ownProps: ownProps) {
    const searchTerm = state.views.search.modalSearch;

    const group = getGroupById(state, ownProps.groupId);

    let users: UserProfile[] = [];
    if (searchTerm) {
        users = searchProfilesInGroup(state, ownProps.groupId, searchTerm)
    } else {
        users = getProfilesInGroup(state, ownProps.groupId);
    }

    return {
        group,
        users,
        searchTerm,
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators<ActionCreatorsMapObject<ActionFunc | GenericAction>, Actions>({
            getGroup,
            getUsersInGroup,
            setModalSearchTerm,
            openModal,
            searchProfiles,
            removeUsersFromGroup,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewUserGroupModal);
