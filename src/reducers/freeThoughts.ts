import State from '../@types/State'
import Thought from '../@types/Thought'
import { ABSOLUTE_TOKEN, EM_TOKEN, HOME_TOKEN, MAX_THOUGHTS, MAX_THOUGHTS_MARGIN } from '../constants'
import globals from '../globals'
import { getAllChildren } from '../selectors/getChildren'
import getDescendantThoughtIds from '../selectors/getDescendantThoughtIds'
import thoughtToPath from '../selectors/thoughtToPath'
import head from '../util/head'
import isAttribute from '../util/isAttribute'
import deleteThought from './deleteThought'

/** Frees a random block of invisible thoughts from memory when the memory limit is exceeded. Note: May not free any thoughts if all thoughts are expanded. */
const freeThoughts = (state: State) => {
  const expandedIds = Object.values(state.expanded).map(head)
  const preserveSet = new Set([
    ABSOLUTE_TOKEN,
    EM_TOKEN,
    HOME_TOKEN,
    // prevent the last imported thought from being deallocated, as the thought or one of its ancestors needs to stay in memory for the next imported thought
    ...(globals.lastImportedPath || []),
    ...expandedIds.flatMap(id => [id, ...getAllChildren(state, id)]),
    ...getDescendantThoughtIds(state, EM_TOKEN),
  ])

  // Split the list at a random index to avoid the same thoughts getting deallocated every time.
  // Better would be to sort by lastUpdated or lastVisited, but this is much faster.
  const randomStartIndex = Math.floor(Math.random() * Object.values(state.thoughts.thoughtIndex).length)

  /** Find the next thought that can be safely deallocated. */
  const findDeletableThought = (state: State): Thought | null => {
    const allThoughts = Object.values(state.thoughts.thoughtIndex)

    /** Returns true if a thought is safe to deallocate. */
    const isDeletable = (thought: Thought) =>
      // do not delete any thought or child of a thought in the preserve set
      !preserveSet.has(thought.id) &&
      !preserveSet.has(thought.parentId) &&
      // do not delete a thought with a missing parent
      state.thoughts.thoughtIndex[thought.parentId] &&
      // do not delete meta attributes, or their descendants
      !isAttribute(thought.value) &&
      !thoughtToPath(state, thought.parentId).some(id => isAttribute(state.thoughts.thoughtIndex[id]?.value))

    // start searching at the randomStartIndex and wrap around the end of the array of thoughts
    let deletableThought: Thought | null = null
    // eslint-disable-next-line fp/no-loops
    for (let i = 0; i++; i < allThoughts.length) {
      const thought = allThoughts[(i + randomStartIndex) % allThoughts.length]
      if (isDeletable(thought)) {
        deletableThought = thought
        break
      }
    }

    return deletableThought
  }

  // iterate over the entire thoughtIndex, deleting thoughts that are no longer visible
  let stateNew = state

  // free thoughts until MAX_THOUGHTS is reached (minus MAX_THOUGHTS_MARGIN to provide some slack)
  // eslint-disable-next-line fp/no-loops
  while (Object.values(stateNew.thoughts.thoughtIndex).length > MAX_THOUGHTS - MAX_THOUGHTS_MARGIN) {
    // find a thought that can be deleted
    const deletableThought = findDeletableThought(stateNew)
    // If all thoughts are preserved, we should bail.
    // This is unlikely to happen, as MAX_THOUGHT_INDEX should usually exceed the number of visible thoughts.
    // In the worst case, this results in continuous attempts until the user collapses some thoughts, but will be throttled by the freeThoughts middleware.
    if (!deletableThought) break

    // delete the thought and all descendants to ensure thoughtIndex is still in integrity
    stateNew = deleteThought(stateNew, {
      thoughtId: deletableThought.id,
      pathParent: thoughtToPath(stateNew, deletableThought.parentId),
      // do not persist deletions; just delete from stateNew
      local: false,
      remote: false,
    })
  }

  return stateNew
}

export default freeThoughts
