import React from 'react';
import {Chip, Container, Popover, PopoverProps, Stack, Typography} from '@mui/material';
import {MankaArchive, MankaArchiveTag} from '../../types';
import _ from 'lodash'

export interface MankaPopoverProps {

    //锚点
    anchorEl: HTMLElement | null;

    onClose: () => void;

    manka: MankaArchive;

    clickTagCallback?: (tag: MankaArchiveTag) => void;

    //属性
    props?: PopoverProps;
}

export default function MankaTagsPanelPopover(options: MankaPopoverProps) {

    const {
        anchorEl, props, onClose, manka, clickTagCallback = (tag) => {
        }
    } = options

    const TagsPanel: React.FC = () => {
        const {tags = []} = manka
        if (tags.length <= 0) {
            return (
                <Typography>No Tags</Typography>
            )
        }
        //tagGroups
        const tagGroups = _.groupBy(tags, tag => tag.tagName)
        //利用tagGroups 进行渲染
        return (
            <React.Fragment>
                <Container
                    maxWidth={"md"}

                >
                    {Object.keys(tagGroups).map((tagName, index) => (
                        <div key={tagName}>
                            <span>{tagName}</span>
                            <Stack
                                direction={{xs: 'column', sm: 'row'}}
                                spacing={{xs: 1, sm: 2, md: 4}}
                            >
                                {tagGroups[tagName].map(tag => (
                                    <Chip size="small"
                                          key={`${tag.tagName}_${tag.tagValue}`}
                                          label={tag.tagValue}
                                          onClick={() => clickTagCallback(tag)}/>

                                ))}
                            </Stack>
                        </div>
                    ))}
                </Container>
            </React.Fragment>
        )
    }

    return (
        <Popover
            id="cover_papover"
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            disableRestoreFocus
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            {...props}
        >
            <TagsPanel/>
        </Popover>
    )
}